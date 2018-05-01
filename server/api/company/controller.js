const Company = require('./model')

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Company.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
