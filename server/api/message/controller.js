const Message = require('./model')
const User = require('../user/model')
const {
  ObjectId
} = require('mongoose').Types


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
exports.messagesStudentAndProForReferent = (req, res, next) => {
  const {
    referent
  } = req.params

  return User.findById(referent)
    .populate('account.students')
    .then(async referent => {
      const {
        students
      } = referent.account

      const messages = []

      // trouver tous les messages où le sender est le pro
      // autrement dit les messages qu'à reçu le student
      // on les trouve en recherchant les messages où les recipient sont les élèves
      for (let i = 0; i < students.length; i++) {
        const student = students[i]

        const message = await Message.find({
            recipient: new ObjectId(student._id),
          })
          .select('-files -recipient -__v')
          .populate({
            path: 'sender', // pro
            select: '_id email account.first_name account.last_name account.type account.company',
            populate: {
              path: 'account.company',
              select: 'name logo -_id'
            }
          })

        //si il y a un message on le return
        if (Boolean(message.length)) {
          messages.push(...message)
        }
      }

      // trouver tous les messages où le sender est le student
      // autrement dit les messages qu'à reçu le référent
      // on les trouve en recherchant les messages où les sender sont les élèves
      for (let i = 0; i < students.length; i++) {
        const student = students[i]

        const message = await Message.find({
            sender: new ObjectId(student._id)
          })
          .select('-files -recipient -__v')
          .populate({
            path: 'sender', // étudiant
            select: '_id email account.picture account.curriculum account.first_name account.last_name account.type',
          })

        //si il y a un message on le return
        if (Boolean(message.length)) {
          messages.push(...message)
        }
      }

      //trier les messages par date
      messages.sort((a, b) => new Date(b.date) - new Date(a.date))

      res.status(201).json(messages)

    })
    .catch(error => next(error))
}

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