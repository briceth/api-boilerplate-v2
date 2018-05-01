const Offer = require('./model')

//GET CONTROLLEURS
exports.getAll = (req, res, next) => {
  return Offer.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Offer.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.toggleActive = (req, res, next) => {
  const { id } = req
  const { is_active } = req.body

  return Offer.findOneAndUpdate(id, { is_active }, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.delete = (req, res, next) => {
  const { id } = req.body

  return Offer.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
