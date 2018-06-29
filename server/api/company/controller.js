const Company = require('./model')

//GET CONTROLLERS

// - 1 renvoye TOUS les messages
exports.getAll = (req, res, next) => {
  return Company.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Company.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
