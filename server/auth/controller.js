const uid2 = require('uid2')
const cloudinary = require('cloudinary').v2

const config = require('../../config')
const {
  avatarConfig,
  diaryConfig,
  curriculumConfig,
  logoConfig,
  defaultConfig
} = require('./upload/cloudinary')
const User = require('../api/user/model')
const Company = require('../api/company/model')
// const confirmEmail = require('../emails/confirmationEmail')

const mailgunModule = require('../emails/mailgun')

// cloudinary credentials
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
})

exports.verifyToken = function(req, res, next) {
  User.findOne({ token: req.body.token })
    .populate({
      path: 'account.company'
    })
    .then(doc => {
      if (!doc) return res.status(400)

      res.json({ user: doc })
    })
    .catch(error => next(error))
}

exports.signUp = function(req, res, next) {
  if (req.err) return next(err)

  // rendre la création d'un compte administrateur impossible via cette route
  const authorizedTypes = ['college', 'student', 'hr', 'pro', 'referent']
  if (!authorizedTypes.includes(req.body.type)) {
    return res.status(401).json({ message: 'Unauthorized type' })
  }
  // bloquer la création d'un compte actif
  const { type } = req.body
  const is_active = type === 'hr' || type === 'student' ? false : true

  const { password, email, oauthID, ...rest } = req.body

  User.register(
    new User({
      email: req.user && req.user.email ? req.user.email : req.body.email,
      token: uid2(32), // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.
      oauthID: req.user && req.user.oauthID,
      account: { ...rest, is_active },

      passwordChange: req.body.type === 'referent' && {
        token: uid2(24),
        expiryDate: new Date(Date.now() + 604800000)
      }
    }),
    req.body.password ? req.body.password : uid2(16), // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
    async (error, user) => {
      if (error) {
        return next(error)
      } else {
        const url = req.headers.origin //pour localhost et pour l'url de production

        if (config.ENV !== 'test' && user.account.type === 'referent') {
          mailgunModule.sendPassword(url, user, user.passwordChange.token)
        }

        resLoginAndSignUp(res, next, user, 201)
      }
    }
  )
}

exports.logIn = (req, res, next) => {
  if (req.err) {
    return res.status(401)
  }

  if (req.authInfo.newUser) {
    const { oauthID, email, first_name, last_name, is_created } = req.user
    const user = {
      oauthID,
      email,
      first_name,
      last_name,
      is_created
    }
    return res.status(202).json({
      message: 'Welcome to our new user 🤩',
      user
    })
  }

  resLoginAndSignUp(res, next, req.user, 200)
}

function resLoginAndSignUp(res, next, newUser, status) {
  const { _id, oauthID, email, token, account, is_created } = newUser
  const user = {
    _id,
    oauthID,
    email,
    token,
    account,
    is_created
  }

  if (account.type !== 'pro' || 'hr') {
    return res.status(status).json({
      message: 'User successfully signed up 🤩',
      user
    })
  }

  Company.findById(account.company)
    .then(doc => {
      user.account.company = doc

      return res.status(status).json({
        message: 'User successfully signed up 🤩',
        user
      })
    })
    .catch(error => next(error))
}

// UPLOAD controllers
exports.upload = function(req, res, next) {
  let config
  switch (req.body.type) {
    case 'picture':
      config = avatarConfig
      break
    case 'diary':
      config = diaryConfig
      break
    case 'curriculum':
      config = curriculumConfig
      break
    case 'logo':
      config = logoConfig
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
      message: 'Fichier téléchargé avec succès !',
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
      message: 'Fichier supprimé avec succès !'
    })
  })
}

// COMPANY controllers
exports.getAllCompanyNames = (req, res, next) => {
  Company.find({})
    .select('name')
    .then(doc => {
      res.json(doc)
    })
    .catch(error => next(error))
}

exports.createCompany = (req, res, next) => {
  const { body } = req

  Company.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// COLLEGE controllers
exports.getAllCollegeNames = (req, res, next) => {
  User.aggregate([
    {
      $match: { 'account.type': 'college' }
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$account.college_name' }
      }
    }
  ])
    .then(doc => {
      res.json(doc)
    })
    .catch(error => next(error))
}

// PASSWORD controllers
exports.forgotPassword = (req, res, next) => {
  const { email } = req.body

  if (!email)
    return res.status(400).json({
      message: 'Email obligatoire'
    })
  User.findOne(
    {
      email
    },
    (error, user) => {
      if (error) {
        return res.status(500).json({
          message: 'Erreur serveur'
        })
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
          return res.status(500).json({
            message: 'Erreur serveur'
          })
        }
        if (config.ENV !== 'test') {
          const url = req.headers.origin
          mailgunModule.forgotPassword(url, user)
        }
        res.json({
          message:
            'Un email vous a été envoyé pour réinitialiser votre mot de passe.'
        })
      })
    }
  )
}

exports.resetPassword = (req, res, next) => {
  const { password, token } = req.body

  if (!password) {
    return res.status(400).json({
      message: 'Le mot de passe est obligatoire.'
    })
  }

  User.findOne(
    {
      'passwordChange.token': token
    },
    function(err, user) {
      if (err) {
        return res.status(500).json({
          message: 'Erreur serveur.'
        })
      }

      if (!user)
        return res.status(401).json({
          message: 'Ce lien est invalide.'
        })

      if (user.passwordChange.expiryDate < Date.now()) {
        return res.status(401).json({
          message: 'Ce lien a expiré (la validité des liens est de 24h).'
        })
      }

      user.setPassword(password, () => {
        user.passwordChange.expiryDate = Date.now()

        user.save(error => {
          if (error) {
            return res.status(500).json({
              message: 'Erreur serveur.'
            })
          }
        })
        res.json({
          message: 'Mot de passe défini avec succès !'
        })
      })
    }
  )
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
