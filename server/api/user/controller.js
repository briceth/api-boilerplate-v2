const User = require('./model')
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

/**
 * 1 - on cherche le collège par son id
 * 2 - on récupère l'id et on cherche les students qui ont l'id de ce collège
 * @param {ObjectId} id
 * @param {ObjectId} doc._id
 * @return {array} - [{_id, account: { class: { name }, first_name, last_name, type, picture }, application: { number, statut } }]
 */
exports.getStudentsFromCollege = (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(doc => {
      User.find({
        'account.type': 'student',
        'account.college': new ObjectId(doc._id)
      })
        .populate({
          path: 'account.class',
          select: 'name -_id'
        })
        .select({
          'account.type': 1,
          'account.first_name': 1,
          'account.last_name': 1,
          'account.picture': 1,
          'account.first_connection': 1
        })
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

/**
 * on cherche le collège par son id
 * on récupère son _id et on cherche les students qui ont l'id de ce collège
 * @param {ObjectId} id
 * @param {ObjectId} doc._id
 * @return {array} - [{_id, email, account: { first_name, last_name, type } }]
 */
exports.getReferentsFromCollege = (req, res, next) => {
  const { id } = req.params
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
          })
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

/**
 * on cherche le reférent par son id
 * besoin d'avoir tous les élèves du référent
 * besoin du nom de la classe pour chaque élève
 * @param {ObjectId} id
 * @param {array} docs.account.students - les élèves du référent
 * @return {array} - [{_id, account, application: { statut, number } }]
 */
// exports.getStudentsFromReferent = (req, res, next) => {
//   const { id } = req.params
//   // 1 - on cherche les classes ayant ce référent
//   // 2 - on cherche les users ayant cette classe
//   // 3 - besoin du nom de la classe pour chaque élève
//   Class.find({ referent: id })
//     .then(classes => {
//       if (classes.length < 1) {
//         return res.status(201).json({
//           message: 'Aucune classe ne vous a été attribuée'
//         })
//       }

//       User.find({ 'account.class': { $in: classes } })
//         .populate({
//           path: 'account.class',
//           select: 'name -_id'
//         })
//         .then(async students => {
//           const result = await getApplications(students)
//           return res.status(201).json(result)
//         })
//         .catch(error => next(error))
//     })
//     .catch(error => next(error))
// }

// POST CONTROLLERS
exports.create = (req, res, next) => {
  const { body } = req

  return User.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

// PUT CONTROLLERS
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

/**
 * 0n update la première connection du user à FALSE
 * pour pas qu'elle se tape le stepper (le tuto affiché à la première connection)
 * @param {Boolean} first_connection
 * @return {object} - message & first_connection
 */
exports.updateFirstConnection = (req, res, next) => {
  const { first_connection } = req.body
  const { id } = req.params

  return User.findByIdAndUpdate(
    id,
    {
      $set: {
        account: {
          first_connection
        }
      }
    },
    {
      new: true
    }
  )
    .then(user => {
      return res.status(201).json({
        message: `le user ${user._id} a été modifié`,
        user
      })
    })
    .catch(error => next(error))
}

exports.updateCreated = (req, res, next) => {
  const { id } = req.params

  const is_created = {}

  if (req.body.referent) is_created.referent = req.body.referent
  if (req.body.class) is_created.class = req.body.class

  return User.findByIdAndUpdate(
    id,
    {
      $set: {
        is_created
      }
    },
    {
      new: true
    }
  )
    .then(user => {
      return res.status(201).json({
        message: `le user ${user._id} a été modifié`,
        user
      })
    })
    .catch(error => next(error))
}

exports.removeCollege = (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(college => {
      // supprime le collège et tous les élèves et les référents lié à ce collège
      User.remove({
        $or: [
          {
            _id: college._id
          },
          {
            'account.college': college._id
          }
        ]
      }).then(doc => {
        return res.status(201).json({
          message: `le collège a été supprimé avec succès! 
                    Total : ${doc.n} utilisateurs supprimés`
        })
      })
    })
    .catch(error => next(error))
}
