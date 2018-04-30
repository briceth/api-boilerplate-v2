const Offer = require('./model')

exports.create = (req, res, next) => {
  const { body } = req

  return Offer.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAll = (req, res, next) => {
  return Offer.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.toggleActive = (req, res, next) => {
  const { id } = req
  const { is_active } = req.body

  return Offer.findOneAndUpdate(id, { is_active }, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.delete = (req, res, next) => {
  const { id } = req.body

  return Offer.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
