const config = require('../../../config')
const User = require('./model')
const uid2 = require('uid2')
const passport = require('passport')
const confirmEmail = require('../../emails/confirmationEmail')
const forgetPasswordEmail = require('../../emails/forgetPasswordEmail')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
})

exports.create = (req, res, next) => {
  const { body } = req

  return User.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAll = (req, res, next) => {
  return User.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//MANQUE LA PHOTO
exports.update = (req, res, next) => {
  const { body, id } = req

  return User.findOneAndUpdate(id, body, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAllByType = (req, res, next) => {
  const { type } = req.params

  return User.find({ 'account.type': type })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getStudentsFromCollege = (req, res, next) => {
  const { id } = req

  return User.find({ 'student.college': id })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.initial_get_user = function(req, res, next) {
  const { currentUser } = req
  User.findById(req.params.id)
    .select('account')
    // .populate("account")
    .exec()
    .then(user => {
      const { _id, account } = user

      if (!user) {
        res.status(404)
        return next('User not found')
      }

      return res.json({ _id, account })
    })
    .catch(err => {
      console.error(err.message)
      res.status(400)
      return next(err.message)
    })
}
