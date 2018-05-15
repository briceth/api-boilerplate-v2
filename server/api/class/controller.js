const Class = require('./model')
const ObjectId = require('mongoose').Types.ObjectId

//GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getClassFromCollege = (req, res, next) => {
  const {
    id
  } = req.params

  return Class.find({
      college: new ObjectId(id)
    })
    .populate({
      path: "referent",
      select: "account.first_name account.last_name"
    })
    .select('name date _id is_active')
    .sort({
      date: 1
    })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}


//POST CONTROLLERS
exports.create = (req, res, next) => {
  const {
    body
  } = req
  console.log("body", req.body)

  return Class.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.addStudent = (req, res, next) => {
  const {
    params: {
      student
    },
    id
  } = req

  //addToSet only update if element is not present
  return Class.findByIdAndUpdate(
      id, {
        $addToSet: {
          students: student
        }
      }, {
        new: true
      }
    )
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.addReferent = (req, res, next) => {
  const {
    id
  } = req.params

  const {
    referent
  } = req.body

  return Class.findByIdAndUpdate(id, {
      $set: {
        referent: req.body.referent
      }
    }, {
      new: true
    })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.toggleActive = (req, res, next) => {
  const {
    body: {
      boolean
    },
    params: {
      id
    }
  } = req

  return Class.findByIdAndUpdate(id, {
      $set: {
        is_active: boolean
      }
    }, {
      new: true
    })
    .then(doc => res.status(201).json({
      is_active: true
    }))
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.removeReferent = (req, res, next) => {
  const {
    id
  } = req.body

  return Class.findByIdAndUpdate(id, {}, {
      new: true
    })
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}



exports.delete = (req, res, next) => {
  const {
    id
  } = req.body

  return Class.findByIdAndRemove(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}