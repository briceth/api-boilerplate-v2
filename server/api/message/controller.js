const Message = require('./model')
const User = require('../user/model')
const {
  ObjectId
} = require('mongoose').Types

const {
  PerformanceObserver,
  performance
} = require('perf_hooks')

//PARAM
exports.findByParam = (req, res, next, id) => {
  return Message.findById(id)
    .then(doc => {
      if (!doc) {
        next(new Error('No doc Found'))
      } else {
        req.doc = doc
        next()
      }
    })
    .catch(error => {
      next(error)
    })
}

//GET CONTROLLERS

// - 1 renvoye TOUS les messages
exports.getAll = (req, res, next) => {
  return Message.find({})
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}


// - 1 trouver les élèves du référent
// - 2 itérer sur ses élèves pour récupérer les messages qui ont leur _id
// - 3 populate les id des pros et des élèves dans le message pour récupérer le first_name, last_name et le role
//     ça sera beaucoup plus simple à manipuler côté Front
// - 4 renvoyer les messages qui ne sont pas vide

// - Problème: comment afficher deux fois le message au client... un pour le recipient et l'autre pour le sender
// - Solution: afficher uniquement le message du sender (celui qui envoie)

// - TODO: transformer cette reqête avec aggregate
// performance.mark('start')
exports.messagesStudentAndProForReferent = (req, res, next) => {
  //console.time('message.find');
  const {
    referent
  } = req.params

  User.findById(referent)
    .populate('account.students')
    .then(async referent => {
      const {
        students
      } = referent.account

      const message = await Message.find({
          $or: [{
              recipient: {
                $in: students
              }
            },
            {
              sender: {
                $in: students
              }
            }
          ]
        })
        .select('-files -recipient -__v')
        .populate({
          path: 'sender',
          select: '_id email account.color account.picture account.curriculum account.first_name account.last_name account.type account.company',
          populate: {
            path: 'account.company',
            select: 'name logo -_id'
          }
        })

      //trier les messages par date
      message.sort((a, b) => new Date(b.date) - new Date(a.date))

      //console.timeEnd('message.find');


      res.status(201).json(message)
    })
    .catch(error => next(error))
}

// performance.mark('end')
// performance.measure('messagesStudentAndProForReferent', 'start', 'end')

//POST CONTROLLERS
// - 1 créer un message sans validation
exports.create = (req, res, next) => {
  const {
    body
  } = req

  return Message.create(body)
    .then(doc => res.status(201).json(doc))
    .catch(error => next(error))
}

//PUT CONTROLLERS
exports.updateRead = (req, res, next) => {
  //req.doc vient du controlleur findByParam
  req.doc.read = true
  return req.doc.save()
    .then(doc => res.status(201).json({
      read: doc.read
    }))
    .catch(error => next(error))
}


//il faut requêter les messages de l'élève du référent
// ainsi que les messages de l'entreprise à l'élève

// le référent a des élèves et ses élèves ont des messages