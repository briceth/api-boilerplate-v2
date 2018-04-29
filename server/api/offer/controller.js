const Offer = require('./model')

exports.create = (req, res, next) => {
  const { body } = req

  return Offer.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.all = (req, res, next) => {
  return Offer.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.standBy = (req, res, next) => {
  const { body, id } = req

  return Offer.findOneAndUpdate(id, body, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.delete = (req, res, next) => {
  const { id } = req.body

  return Offer.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
