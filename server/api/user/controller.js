const uid2 = require('uid2')
const passport = require('passport')

const config = require('../../../config')
const User = require('./model')
const Class = require('../class/model')
const { getApplications } = require('./controller.helpers')
const { ObjectId } = require('mongoose').Types

// GET CONTROLLERS
exports.getById = (req, res, next) => {
  const { id } = req.params

  return User.findById(id)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAll = (req, res, next) => {
  return User.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

exports.getAllByType = (req, res, next) => {
  const { type } = req.params

  return User.find({
    'account.type': type
  })
    .then(docs => res.status(201).json(docs))
    .catch(error => next(error))
}

exports.getStudentsFromCollege = user => (req, res, next) => {
  const { id } = req.params
  // 1 - on cherche le collège par son id
  // 2 - on récupère l'id et on cherche les students qui ont l'id de ce collège
  User.findById(id)
    .then(doc => {
      User.find({
        'account.type': 'student',
        ['account.' + user]: new ObjectId(doc._id)
      })
        .populate({
          path: 'account.class',
          select: 'name -_id'
        }) // besoin du nom de la classe de l'élève
        .select({
          'account.type': 1,
          'account.first_name': 1,
          'account.last_name': 1,
          'account.picture': 1
        }) // besoin du prénom, nom et photo de l'élève
        .sort({
          'account.last_name': 1
        })
        .then(async docs => {
          const result = await getApplications(docs)
          return res.status(201).json(result)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
}

exports.getReferentsFromCollege = (req, res, next) => {
  const { id } = req.params
  // 1 - on cherche le collège par son id
  // 2 - on récupère l'id et on cherche les students qui ont l'id de ce collège
  return User.findById(id)
    .then(doc => {
      if (doc) {
        User.find({
          'account.type': 'referent',
          'account.college': new ObjectId(doc._id)
        })
          //.populate({path: "account.class", select: 'name -_id'}) //besoin du nom de la classe de l'élève
          .select({
            email: 1,
            'account.type': 1,
            'account.first_name': 1,
            'account.last_name': 1
          }) //besoin du prénom, nom et photo de l'élève
          .sort({
            'account.last_name': 1
          })
          .then(doc => res.status(201).json(doc))
          .catch(error => next(error))
      } else {
        return res.status(404).json({
          message: 'pas encore de référent pour ce collège'
        })
      }
    })
    .catch(error => next(error))
}

exports.getStudentsFromReferent = (req, res, next) => {
  const { id } = req.params
  // 1 - on cherche le reférent par son id
  // 2 - besoin d'avoir tous les élèves du référent
  // 3 - besoin du nom de la classe pour chaque élève
  return User.findById(id)
    .populate({
      path: 'account.students',
      select: 'account.first_name account.last_name',
      populate: {
        path: 'account.class',
        select: 'name -_id'
      }
    })
    .then(async docs => {
      const result = await getApplications(docs.account.students)

      return res.status(201).json(result)
    })
    .catch(error => next(error))
}

// POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return User.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// PUT CONTROLLERS
//TODO: check token user or admin
exports.update = (req, res, next) => {
  const { body } = req
  const { id } = req.params

  return User.findByIdAndUpdate(id, body, {
    new: true
  })
    .then(doc => {
      // change password if user has provided one
      if (body.password) {
        doc.setPassword(body.password, function(error) {
          if (!error) {
            doc.save(function(error) {
              if (error) next(error)
            })
          } else {
            next(error)
          }
        })
      }
      res.status(201).json(doc)
    })
    .catch(error => next(error))
}

// DELETE CONTROLLERS
exports.removeReferent = (req, res, next) => {
  const { id } = req.params

  return User.findByIdAndRemove(id)
    .then(referent => {
      return Class.findByIdAndUpdate(
        new ObjectId(referent.account.class),
        {
          $unset: {
            referent: 1
          }
        },
        {
          new: true
        }
      )
        .then(doc => {
          const { first_name, last_name } = referent.account

          return res.status(201).json({
            message: 'le référent a été supprimé avec succès!',
            referent: {
              first_name,
              last_name
            },
            doc
          })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
}

exports.removeCollege = (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(college => {
      // supprime le collège et tous les élèves et les référents lié à ce collège
      User.remove({
        $or: [{ _id: college._id }, { 'account.college': college._id }]
      }).then(doc => {
        return res.status(201).json({
          message: `le collège a été supprimé avec succès! 
                    Total : ${doc.n} utilisateurs supprimés`
        })
      })
    })
    .catch(error => next(error))
}

// exports.initial_get_user = function(req, res, next) {
//   const { currentUser } = req
//   User.findById(req.params.id)
//     .select('account')
//     // .populate("account")
//     .exec()
//     .then(user => {
//       const { _id, account } = user

//       if (!user) {
//         res.status(404)
//         return next('User not found')
//       }

//       return res.json({ _id, account })
//     })
//     .catch(err => {
//       console.error(err.message)
//       res.status(400)
//       return next(err.message)
//     })
// }
