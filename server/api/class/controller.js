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
      is_active: -1, // on sort en premier les éléments à true ensuite ceux à false
      name: 1 // une fois que le sort true/false, on sort par le nom
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

// Ajoute un référent à une classe
exports.addReferent = (req, res, next) => {
  const { referent } = req.body

  return Class.findByIdAndUpdate(
    req.params.id,
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
      return res
        .status(201)
        .json({ message: 'Le référent a bien été ajouté !' })
    })

    .catch(error => next(error))
}

// 1 - Supprime le référent d'une classe
exports.removeReferentFromClass = (req, res, next) => {
  return Class.findByIdAndUpdate(
    req.params.id,
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
      res.status(201).json({ message: 'Le référent a bien été supprimé !' })
    })
    .catch(error => next(error))
}

// - Si la classe devient active on ne supprime pas le référent
exports.toggleActive = (req, res, next) => {
  const { is_active } = req.body

  const query = is_active
    ? {
        $set: {
          is_active
        }
      }
    : {
        $set: {
          is_active
        },
        $unset: {
          referent: ''
        }
      }

  Class.findByIdAndUpdate(req.params.id, query, {
    new: true
  })
    .then(doc => {
      res.status(201).json({
        message: 'La changement a bien été effectué'
      })
    })
    .catch(error => next(error))
}
