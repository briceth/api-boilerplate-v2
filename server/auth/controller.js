const config = require('../../config')
// const mailgun = require('mailgun-js')({
//   apiKey: config.MAILGUN_API_KEY,
//   domain: config.MAILGUN_DOMAIN
// })
const uid2 = require('uid2')
const passport = require('passport')
const cloudinaryStorage = require('multer-storage-cloudinary')
const User = require('../api/user/model')
const confirmEmail = require('../emails/confirmationEmail')
const forgetPasswordEmail = require('../emails/forgetPasswordEmail')
const log = console.log
const error = console.error
const mailgunModule = require('../emails/mailgun')

exports.signUp = (req, res, next) => {
  const { password, ...rest } = req.body

  User.register(
    new User(rest),
    password, // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    async (error, user) => {
      if (error) {
        config.ENV !== 'test' && console.error(error)

        // TODO: test
        return res.status(400).json({ error: error.message })
      } else {
        const url = req.headers.host //pour localhost et pour l'url de production

        if (config.ENV !== 'test' && user.account.type === 'referent') {
          mailgunModule.sendPassword(url, user, password)
        }

        const { _id: id, token, account, email } = user

        return res.status(201).json({
          message: 'User successfully signed up 🤩',
          email,
          account,
          id,
          token
        })
      }
    }
  )
}

exports.logIn = (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) {
      res.status(400)
      return next(error.message)
    }

    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    if (!user.emailCheck.valid) {
      return res.status(206).json({ message: 'Please confirm email first' })
    }

    const { _id: id, token, account } = user

    res.json({
      message: 'Login successful',
      user: {
        id,
        token,
        account
      }
    })
  })(req, res, next)
}

// TODO: gérer cas d'erreurs
exports.uploadAvatar = (req, res, next) => {
  const image = {
    version: req.file.version,
    public_id: req.file.public_id,
    mimetype: req.file.mimetype,
    secure_url: req.file.secure_url
  }

  res.json({
    message: 'Image uploaded',
    image
  })
}

exports.forgottenPassword = (req, res, next) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: 'No email specified' })
  User.findOne({ email }, (error, user) => {
    if (error) {
      res.status(400)
      return next(error.message)
    }
    if (!user) {
      return res.status(400).json({
        error: "We don't have a user with this email in our dataBase"
      })
    }
    if (!user.emailCheck.valid) {
      return res.status(400).json({ error: 'Your email is not confirmed' })
    }

    user.passwordChange = {
      token: uid2(20),
      createdAt: new Date(),
      valid: true
    }

    user.save(error => {
      if (error) {
        log('Error when saving user with passwordChange infos : ', error)

        return res
          .status(400)
          .json({ error: 'Error when setting recovering infos in user ' })
      }
      if (config.ENV === 'production') {
        const url = req.headers.host

        mailgun
          .messages()
          .send(forgetPasswordEmail(url, user), (error, body) => {
            error('Mail Error', error)
            log('Mail Body', body)
          })
      }
      res.json({
        message: 'An email has been send with a link to change your password'
      })
    })
  })
}

exports.emailCheck = (req, res) => {
  const { email, token } = req.query

  if (!token) return res.status(400).send('No token specified')

  User.findOne({ 'emailCheck.token': token, email }, (error, user) => {
    if (error) return res.status(400).send(error)

    if (!user) return res.status(400).send('Wrong credentials')

    if (user.emailCheck.valid) {
      return res
        .status(206)
        .json({ message: 'You have already confirmed your email !' })
    }

    var yesterday = new Date()

    yesterday.setDate(yesterday.getDate() - 1)

    if (user.emailCheck.createdAt < yesterday) {
      return res.status(400).json({
        message:
          'This link is outdated (older than 24h), please try to sign up again'
      })
    }

    user.emailCheck.valid = true

    user.save(error => {
      if (err) return res.send(err)
      res.json({ message: 'Your email has been verified with success' })
    })
  })
}

exports.resetPasswordGET = (req, res) => {
  res.json({ message: 'Ready to recieve new password' })
}

exports.resetPasswordPOST = (req, res, next) => {
  const {
    user,
    body: { newPassword, newPasswordConfirmation }
  } = req

  if (!newPassword) {
    return res.status(400).json({ error: 'No password provided' })
  }
  if (newPassword !== newPasswordConfirmation) {
    return res
      .status(400)
      .json({ error: 'Password and confirmation are different' })
  }

  user.setPassword(newPassword, () => {
    user.passwordChange.valid = false

    user.save(error => {
      if (error) {
        res.status(500)
        return next(error.message)
      }
    })
    res.status(200).json({ message: 'Password reset successfully !' })
  })
}
