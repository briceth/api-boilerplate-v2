const Candidature = require('./model')

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Candidature.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.update = (req, res, next) => {
  const { body, id } = req

  return Candidature.findOneAndUpdate(id, body, { new: true })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.delete = (req, res, next) => {
  const { id } = req.body

  return Candidature.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
