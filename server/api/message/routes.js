const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { canUser } = require('../../middlewares/core')

//router.param('id', canUser, controller.findByParam)

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router.route('/:id/read').put(controller.updateRead)

//retourne les messages des étudiants et des pros pour les référents
router.get('/user/:id', controller.getUserMessages)

//retourne les messages des étudiants et des pros pour les référents
// router.get(
//   '/referent/:id/students/pros',
//   controller.messagesStudentAndProForReferent
// )

module.exports = router
