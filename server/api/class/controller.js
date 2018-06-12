const Class = require('./model')
const User = require('../user/model')
const { ObjectId } = require('mongoose').Types

//GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getClassFromCollege = (req, res, next) => {
  const { id } = req.params

  return Class.find({
    college: new ObjectId(id)
  })
    .populate({
      path: 'referent',
      select: 'account.first_name account.last_name'
    })
    .select('name date _id is_active')
    .sort({
      date: 1
    })
    .then(async classes => {
      const finalArray = []
      let number

      // pour chaque classe, trouver le nombre d'élèves
      for (let i = 0; i < classes.length; i++) {
        const classe = classes[i]
        number = await User.find({
          'account.class': classe._id,
          'account.type': 'student' // protection en plus ?
        }).count()

        finalArray.push({
          ...classe.toObject(),
          students: number
        })
      }

      return res.status(201).json(finalArray)
    })
    .catch(error => next(error))
}

//POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return Class.create(body)
    .then(doc => {
      return res.status(201).json({
        doc,
        message: `${doc.name} a été ajouté avec success !`
      })
    })
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.addStudent = (req, res, next) => {
  const {
    params: { student },
    id
  } = req

  //addToSet only update if element is not present
  return Class.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        students: student
      }
    },
    {
      new: true
    }
  )
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// 1 - Ajoute un référent à une classe
// 2 - Ajoute les élèves de la classe à ce référent
exports.addReferent = (req, res, next) => {
  const { id } = req.params

  const { referent } = req.body

  return Class.findByIdAndUpdate(
    id,
    {
      $set: {
        referent
      }
    },
    {
      new: true
    }
  )
    .then(doc => {
      User.find({
        'account.class': new ObjectId(id)
      })
        .select('_id')
        .then(students => {
          // console.log("students", students)
          User.findByIdAndUpdate(
            referent,
            {
              $addToSet: {
                'account.students': students
              }
            },
            {
              new: true
            }
          )
            .then(referent => {
              //console.log('referent', referent);
            })
            .catch(error => next(error))
        })
        .catch(error => next(error))

      return res.status(201).json(doc)
    })
    .catch(error => next(error))
}

// 1 - Supprime le référent d'une classe
// 2 - Supprime également les élèves de la classe au référent
exports.removeReferentFromClass = (req, res, next) => {
  const { id } = req.params

  const { referent } = req.body

  // 1
  Class.findByIdAndUpdate(
    id,
    {
      $unset: {
        referent: ''
      }
    },
    {
      new: true
    }
  )
    .then(doc => {
      User.find({
        'account.class': new ObjectId(id)
      })
        .select('_id')
        .then(students => {
          // 2
          User.findByIdAndUpdate(
            referent,
            {
              $pull: {
                'account.students': {
                  $in: students
                }
              }
            },
            {
              new: true
            }
          ).catch(error => next(error))
        })
        .catch(error => next(error))

      return res.status(201).json({
        message: 'Le référent a bien été supprimé !'
      })
    })
    .catch(error => next(error))
}

exports.toggleActive = (req, res, next) => {
  const {
    body: { boolean },
    params: { id }
  } = req

  return Class.findByIdAndUpdate(
    id,
    {
      $set: {
        is_active: boolean
      }
    },
    {
      new: true
    }
  )
    .then(doc =>
      res.status(201).json({
        is_active: true
      })
    )
    .catch(error => next(error))
}

//DELETE CONTROLLERS
exports.removeReferent = (req, res, next) => {
  const { id } = req.body

  return Class.findByIdAndUpdate(
    id,
    {},
    {
      new: true
    }
  )
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.delete = (req, res, next) => {
  const { id } = req.params

  return Class.findByIdAndRemove(id)
    .then(doc =>
      res.status(201).json({
        id: doc.id,
        message: 'class has been removed'
      })
    )
    .catch(error => next(error))
}
