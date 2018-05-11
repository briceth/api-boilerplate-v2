const Candidature = require('./model')

//GET CONTROLLERS
exports.getApplicationsFromStudent = (req, res, next) => {
  const { id } = req.params
  console.log('yep');
  
  return Candidature.find({ student: id }).count()
    .then(doc => res.status(201).json(doc))
    .then(error => next(error))
}


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
