const Class = require('./model')
const ObjectId = require('mongoose').Types.ObjectId

//GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getClassFromCollege = (req, res, next) => {
  const { id } = req.params

  return Class.find({ college: new ObjectId(id) })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

<<<<<<< Updated upstream
//POST CONTROLLERS
=======
>>>>>>> Stashed changes
exports.create = (req, res, next) => {
  const { body } = req

  return Class.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.addStudent = (req, res, next) => {
  const {
    params: { student },
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

// exports.addReferent = (req, res, next) => {
//   const {
//     body: { referent },
//     id
//   } = req

//   return Class.findOneAndUpdate(id, { $set: { student } }, { new: true })
//     .then(doc => res.status(201).json(doc))
//     .catch(error => next(error))
// }

exports.toggleActive = (req, res, next) => {
  const {
    body: { boolean },
    id
  } = req

  return Class.findOneAndUpdate(
    id,
    { $set: { is_active: boolean } },
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
