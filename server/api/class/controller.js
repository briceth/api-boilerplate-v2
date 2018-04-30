const Class = require('./model')

exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.create = (req, res, next) => {
  const { body } = req

  return Class.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.update = (req, res, next) => {
  const { body, id } = req

  return Class.findOneAndUpdate(id, body, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.delete = (req, res, next) => {
  const { id } = req.body

  return Class.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
