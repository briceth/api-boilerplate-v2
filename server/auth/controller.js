const uid2 = require('uid2')
const passport = require('passport')
const cloudinaryStorage = require('multer-storage-cloudinary')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})
const cloudinary = require('cloudinary').v2
const uniqid = require('uniqid')

const config = require('../../config')
const User = require('../api/user/model')
const confirmEmail = require('../emails/confirmationEmail')
const forgetPasswordEmail = require('../emails/forgetPasswordEmail')

// cloudinary credentials
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
})

exports.signUp = function(req, res, next) {
  User.register(
    new User({
      email: req.body.email,
      token: uid2(32), // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.
      emailCheck: {
        token: uid2(20),
        createdAt: new Date()
      },
      phone: req.body.phone,
      account: {
        type: req.body.type,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        //phone: req.body.phone,
        address: req.body.address,
        loc: [req.body.longitude, req.body.latitude],
        //school: req.body.school, //TODO: Mise en place des ID avec la seed
        //class: req.body.class, //TODO: Idem
        picture: req.body.avatar && req.body.avatar,
        curriculum: req.body.cv && req.body.cv,
        diary_picture: req.body.correspondenceBook
      }
    }),
    req.body.password, // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    function(err, user) {
      if (err) {
        if (config.ENV !== 'development' || 'test') {
          console.error(err)
        }
        //TODO test
        res.status(400).json({ error: err.message })
      } else {
        // sending mails only in production ENV
        if (config.ENV === 'production') {
          const url = req.headers.host
          mailgun
            .messages()
            .send(confirmEmail(url, user), function(error, body) {
              console.error('Mail Error', error)
              console.log('Mail Body', body)
              res.json({
                message: 'User successfully signed up',
                user: {
                  _id: user._id,
                  token: user.token,
                  account: user.account
                }
              })
            })
        } else {
          console.log('COUCOU')
          res.json({
            message: 'User successfully signed up',
            user: {
              _id: user._id,
              token: user.token,
              phone: user.phone, //TODO: à supprimer
              email: user.email, //TODO: à supprimer
              account: user.account
            }
          })
        }
      }
    }
  )
}

exports.logIn = function(req, res, next) {
  passport.authenticate('local', { session: false }, function(err, user, info) {
    if (err) {
      res.status(400)
      return next(err.message)
    }

    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    if (!user.emailCheck.valid)
      return res.status(206).json({ message: 'Please confirm email first' })

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        token: user.token,
        account: user.account
      }
    })
  })(req, res, next)
}

exports.upload = function(req, res, next) {
  console.log(req.files)
  const avatarConfig = {
    folder: 'avatar',
    public_id: uniqid(),
    allowedFormats: ['jpg', 'png'],
    transformation: [
      { width: 200, height: 200, crop: 'thumb', gravity: 'face' }
    ]
  }
  const correspondenceBookConfig = {
    folder: 'correspondence_book',
    public_id: uniqid(),
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 400, height: 600, crop: 'thumb' }]
  }
  const cvConfig = {
    public_id: uniqid(),
    resource_type: 'raw'
  }
  const defaultConfig = {
    folder: 'other',
    public_id: uniqid(),
    allowedFormats: ['jpg', 'png']
  }

  let config
  switch (req.body.type) {
    case 'avatar':
      config = avatarConfig
      break
    case 'correspondenceBook':
      config = correspondenceBookConfig
      break
    case 'cv':
      config = cvConfig
      break
    default:
      config = defaultConfig
  }

  const filePath = req.files.file.path
  cloudinary.uploader.upload(filePath, config, function(error, result) {
    if (error) {
      return res.status(400).json({
        error: `We couldn't upload your file to our database
                ${error}`
      })
    }

    const image = {
      //version: req.file.version,
      public_id: result.public_id,
      //mimetype: req.file.mimetype,
      secure_url: result.secure_url
    }
    console.log('image', image)
    return res.json({
      message: 'File uploaded',
      image
    })
  })
}

exports.deleteUpload = function(req, res, next) {
  cloudinary.uploader.destroy(req.query.public_id, function(error, result) {
    if (error) {
      return res.status(400).json({
        error: `We couldn't delete your file to our database
                ${error}`
      })
    }
    return res.json({
      message: 'File deleted'
    })
  })
}

exports.forgottenPassword = function(req, res, next) {
  var email = req.body.email
  if (!email) return res.status(400).json({ error: 'No email specified' })
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      res.status(400)
      return next(err.message)
    }
    if (!user)
      return res.status(400).json({
        error: "We don't have a user with this email in our database"
      })
    if (!user.emailCheck.valid)
      return res.status(400).json({ error: 'Your email is not confirmed' })
    user.passwordChange = {
      token: uid2(20),
      createdAt: new Date(),
      valid: true
    }
    user.save(function(error) {
      if (error) {
        console.log(
          'Error when saving user with passwordChange infos : ',
          error
        )
        return res
          .status(400)
          .json({ error: 'Error when setting recovering infos in user ' })
      }
      if (config.ENV === 'production') {
        const url = req.headers.host
        mailgun
          .messages()
          .send(forgetPasswordEmail(url, user), function(error, body) {
            console.error('Mail Error', error)
            console.log('Mail Body', body)
          })
      }
      res.json({
        message: 'An email has been send with a link to change your password'
      })
    })
  })
}

exports.emailCheck = function(req, res) {
  const { email, token } = req.query
  if (!token) return res.status(400).send('No token specified')
  User.findOne({ 'emailCheck.token': token, email: email }, (err, user) => {
    if (err) return res.status(400).send(err)
    if (!user) return res.status(400).send('Wrong credentials')
    if (user.emailCheck.valid)
      return res
        .status(206)
        .json({ message: 'You have already confirmed your email' })
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (user.emailCheck.createdAt < yesterday)
      return res.status(400).json({
        message:
          'This link is outdated (older than 24h), please try to sign up again'
      })
    user.emailCheck.valid = true
    user.save(function(err) {
      if (err) return res.send(err)
      res.json({ message: 'Your email has been verified with success' })
    })
  })
}

exports.resetPasswordGET = function(req, res) {
  res.json({ message: 'Ready to recieve new password' })
}

exports.resetPasswordPOST = function(req, res, next) {
  const { newPassword, newPasswordConfirmation } = req.body
  if (!newPassword)
    return res.status(400).json({ error: 'No password provided' })
  if (newPassword !== newPasswordConfirmation)
    return res
      .status(400)
      .json({ error: 'Password and confirmation are different' })
  const user = req.user
  user.setPassword(newPassword, function() {
    user.passwordChange.valid = false
    user.save(function(error) {
      if (error) {
        res.status(500)
        return next(error.message)
      }
    })
    res.status(200).json({ message: 'Password reset successfully' })
  })
}
