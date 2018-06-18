const passport = require('passport')
const config = require('../../config')
const User = require('../api/user/model')
const { ObjectId } = require('mongoose').Types

exports.errorHandler = (error, req, res, next) => {
  // if (res.statusCode === 200) res.status(400)
  // if (config.ENV === 'production') error = 'An error occurred'
  // return res.json({
  //   error
  // })

  console.log('COUCOU ERROR', error)
  res.status(400).json({
    error: error
  })
}

/**
 * Vérifie si req.user._id (from token) match avec le req.params.id qui doit être modifié
 * @param {string} req.params.id
 * @param {string} req.user._id
 * @return {next()}
 */
exports.canUser = (req, res, next) => {
  const Id = req.params.id || req.body.id

  if (new ObjectId(req.user._id).equals(Id)) {
    return next()
  } else if (req.user.account.type === 'admin') {
    return next()
  } else {
    res.send('this is not the good user')
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.user.account.type === 'admin') {
    return next()
  } else {
    res.send('you are not admin')
  }
}
