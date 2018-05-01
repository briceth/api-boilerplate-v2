const Class = require('./model')
const ObjectId = require('mongoose').Types.ObjectId

//GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

<<<<<<< HEAD
exports.getClassFromCollege = (req, res, next) => {
  const { id } = req.params

  return Class.find({ college: new ObjectId(id) })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

=======
//POST CONTROLLERS
>>>>>>> create-models
exports.create = (req, res, next) => {
  const { body } = req

  return Class.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.addStudent = (req, res, next) => {
  const {
    body: { student },
    id
  } = req

  //addToSet only update if id not present
  return Class.findOneAndUpdate(
    id,
    { $addToSet: { students: student } },
    { new: true }
  )
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.delete = (req, res, next) => {
  const { id } = req.body

  return Class.findOneAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}
