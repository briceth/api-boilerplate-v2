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
router
  .route('/referent/:referent/students/pros')
  .get(controller.messagesStudentAndProForReferent)

module.exports = router
