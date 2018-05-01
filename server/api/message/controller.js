const Message = require('./model')

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Message.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
