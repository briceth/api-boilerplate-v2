const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})
const ObjectId = require('mongoose').Types.ObjectId
const uid2 = require('uid2')
const passport = require('passport')
const confirmEmail = require('../../emails/confirmationEmail')
const forgetPasswordEmail = require('../../emails/forgetPasswordEmail')
const config = require('../../../config')
const User = require('./model')

// GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return User.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAllByType = (req, res, next) => {
  const { type } = req.params

  return User.find({
    'account.type': type
  })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getStudentsFromCollege = (req, res, next) => {
  const { college } = req.params

  // 1 - on cherche le collège par le nom
  // 2 - on récupère l'id et on filtre les students qui ont ce collège id
  return User.find({
    'account.type': 'college',
    'account.college_name': college
  })
    .then(doc => {
      User.find({
        'account.type': 'student',
        'account.college': new ObjectId(doc[0]._id)
      })
        .then(doc => res.status(201).json(doc))
        .catch(error => next(error))
    })
    .catch(error => next(error))
}

// POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return User.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// PUT CONTROLLERS
//TODO: MANQUE LA PHOTO
exports.update = (req, res, next) => {
  const { body, id } = req

  return User.findOneAndUpdate(id, body, {
    new: true
  })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// exports.initial_get_user = function(req, res, next) {
//   const { currentUser } = req
//   User.findById(req.params.id)
//     .select('account')
//     // .populate("account")
//     .exec()
//     .then(user => {
//       const { _id, account } = user

//       if (!user) {
//         res.status(404)
//         return next('User not found')
//       }

//       return res.json({ _id, account })
//     })
//     .catch(err => {
//       console.error(err.message)
//       res.status(400)
//       return next(err.message)
//     })
// }
