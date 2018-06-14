const Class = require('./model')
const User = require('../user/model')
const { ObjectId } = require('mongoose').Types

//PARAM
exports.findByParam = (req, res, next, id) => {
  return Class.findById(id)
    .then(doc => {
      if (!doc) {
        next(new Error('No doc Found'))
      } else {
        // console.log('doc', doc)

        req.doc = doc
        next()
      }
    })
    .catch(error => next(error))
}

//GET CONTROLLERS
exports.getAll = (req, res, next) => {
  return Class.find({})
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getClassFromCollege = (req, res, next) => {
  const { college } = req.params

  return Class.find({
    college: new ObjectId(college)
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
  const { student } = req.body

  //addToSet only update if element is not present
  return Class.findByIdAndUpdate(
    req.doc._id,
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
  const { referent } = req.body

  return Class.findByIdAndUpdate(
    req.doc._id,
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
        'account.class': new ObjectId(req.doc._id)
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
  const { referent } = req.body

  // 1
  return Class.findByIdAndUpdate(
    req.body._id,
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
        'account.class': new ObjectId(req.body._id)
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

      res.status(201).json({
        message: 'Le référent a bien été supprimé !'
      })
    })
    .catch(error => next(error))
}

exports.toggleActive = (req, res, next) => {
  const { boolean } = req.body

  return Class.findByIdAndUpdate(
    req.doc._id,
    {
      $set: {
        is_active: boolean
      }
    },
    {
      new: true
    }
  )
    .then(doc => {
      res.status(201).json({
        is_active: true
      })
    })
    .catch(error => next(error))
}
