const uid2 = require('uid2')
const passport = require('passport')
const cloudinary = require('cloudinary').v2
const uniqid = require('uniqid')

const config = require('../../config')
const User = require('../api/user/model')
const confirmEmail = require('../emails/confirmationEmail')

const log = console.log
const error = console.error
const mailgunModule = require('../emails/mailgun')

// cloudinary credentials
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
})

exports.verifyToken = function(req, res, next) {
  User.findOne({ token: req.body.token }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "We don't have a user with this token in our database"
      })
    }

    return res.status(200).json({
      user
    })
  })
}

exports.signUp = function(req, res, next) {
  if (req.err) return res.status(401)

  User.register(
    new User({
      email: req.user && req.user.email ? req.user.email : req.body.email,
      token: uid2(32), // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.
      emailCheck: {
        token: uid2(24),
        createdAt: new Date()
      },
      oauthID: req.user && req.user.oauthID && req.user.oauthID,
      account: {
        type: req.body.type,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        address: req.body.address,
        loc: req.body.loc,
        //school: req.body.school, //TODO: Mise en place des ID avec la seed
        //class: req.body.class, //TODO: Idem
        picture: req.body.picture && req.body.picture,
        curriculum: req.body.curriculum && req.body.curriculum,
        diary_picture: req.body.diary_picture,

        // College
        college_name: req.body.college_name,
        city: req.body.city
      }
    }),
    req.body.password ? req.body.password : uid2(16), // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    function(error, user) {
      if (error) {
        if (config.ENV !== 'test') console.error('ERROR', error)

        // TODO: test
        return res.status(400).json({ error: error.message })
      } else {
        const url = req.headers.host //pour localhost et pour l'url de production

        if (config.ENV !== 'test' && user.account.type === 'referent') {
          mailgunModule.sendPassword(url, user, password)
        }

        const { _id, oauthID, token, email, account } = user
        const userCreated = { _id, oauthID, email, token, account }

        return res.status(201).json({
          message: 'User successfully signed up 🤩',
          user: userCreated, //Besoin de user "en entier" pour context
          email,
          account,
          _id,
          token
        })
      }
    }
  )
}

exports.logIn = (req, res, next) => {
  if (req.err) {
    return res.status(401)
  }

  if (req.authInfo.newUser) {
    const { oauthID, email, first_name, last_name } = req.user
    const user = { oauthID, email, first_name, last_name }
    return res.status(202).json({
      message: 'Welcome to our new user 🤩',
      user
    })
  }

  const { _id, oauthID, email, token, account } = req.user
  const user = { _id, oauthID, email, token, account }
  return res.status(200).json({
    message: 'User successfully signed up 🤩',
    user
  })
}

exports.upload = function(req, res, next) {
  //console.log(req.files)
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
    case 'picture':
      config = avatarConfig
      break
    case 'diary':
      config = correspondenceBookConfig
      break
    case 'curriculum':
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

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ message: 'Email obligatoire' })
  User.findOne({ email }, (error, user) => {
    if (error) {
      return res.status(500).json({ message: 'Erreur serveur' })
    }
    if (!user) {
      return res.status(400).json({
        error: "Nous n'avons pas pu trouver votre compte."
      })
    }
    // if (!user.emailCheck.valid) {
    //   return res.status(400).json({ error: 'Your email is not confirmed' })
    // }

    user.passwordChange = {
      token: uid2(20),
      expiryDate: new Date(Date.now() + 86400000)
    }

    user.save(error => {
      if (error) {
        return res.status(500).json({ message: 'Erreur serveur' })
      }
      //TODO: décommenter le if
      //if (config.ENV === 'production') {
      const url = req.headers.origin
      mailgunModule.forgotPassword(url, user)
      //}
      res.json({
        message:
          'Un email vous a été envoyé pour réinitialiser votre mot de passe.'
      })
    })
  })
}

exports.resetPassword = (req, res, next) => {
  const {
    user,
    body: { password, token }
  } = req

  if (!password) {
    return res.status(400).json({ message: 'Mot de passe obligatoire' })
  }

  User.findOne({ 'passwordChange.token': token }, function(err, user) {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' })
    }

    if (!user) return res.status(401).json({ message: 'Lien invalide' })

    if (user.passwordChange.expiryDate < Date.now()) {
      return res.status(401).json({
        message: 'La validité de ce lien a expiré (plus de 24h)'
      })
    }

    user.setPassword(password, () => {
      user.passwordChange.expiryDate = Date.now()

      user.save(error => {
        if (error) {
          return res.status(500).json({ message: 'Erreur serveur' })
        }
      })
      res.json({ message: 'Mot de passe défini avec succès !' })
    })
  })
}

// exports.emailCheck = (req, res) => {
//   const { email, token } = req.query

//   if (!token) return res.status(400).send('No token specified')

//   User.findOne({ 'emailCheck.token': token, email }, (error, user) => {
//     if (error) return res.status(400).send(error)

//     if (!user) return res.status(400).send('Wrong credentials')

//     if (user.emailCheck.valid) {
//       return res
//         .status(206)
//         .json({ message: 'You have already confirmed your email !' })
//     }

//     var yesterday = new Date()

//     yesterday.setDate(yesterday.getDate() - 1)

//     if (user.emailCheck.createdAt < yesterday) {
//       return res.status(400).json({
//         message:
//           'This link is outdated (older than 24h), please try to sign up again'
//       })
//     }

//     user.emailCheck.valid = true

//     user.save(error => {
//       if (err) return res.send(err)
//       res.json({ message: 'Your email has been verified with success' })
//     })
//   })
// }
