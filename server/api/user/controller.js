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
  const { id } = req.params
  // 1 - on cherche le collège par son id
  // 2 - on récupère l'id et on cherche les students qui ont l'id de ce collège
 return User.findById(id)
    .then(doc => {
      User.find({
        'account.type': 'student',
        'account.college': new ObjectId(doc._id)
      })
        .populate({path: "account.class", select: 'name -_id'}) //besoin du nom de la classe de l'élève
        .select({ 'account.type': 1, 'account.first_name': 1, 'account.last_name': 1, 'account.picture': 1 }) //besoin du prénom, nom et photo de l'élève
        .then(doc => res.status(201).json(doc))
        .catch(error => next(error))
    })
    .catch(error => next(error))
}

exports.getReferentsFromCollege = (req, res, next) => {
  const { id } = req.params
  // 1 - on cherche le collège par son id
  // 2 - on récupère l'id et on cherche les students qui ont l'id de ce collège
 return User.findById(id)
    .then(doc => {
      User.find({
        'account.type': 'referent',
        'account.college': new ObjectId(doc._id)
      })
        //.populate({path: "account.class", select: 'name -_id'}) //besoin du nom de la classe de l'élève
        .select({ 'email': 1, 'account.type': 1, 'account.first_name': 1, 'account.last_name': 1 }) //besoin du prénom, nom et photo de l'élève
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
//TODO: MANQUE LA PHOTO + on update tout ou uniquement ce dont on a besoin ? je pense qu'il faut tout updater car il n'y a pas 40 infos
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
