const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { canCollege } = require('../../middlewares/core')

router.param('id', controller.findByParam)

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router.put(
  '/:id/remove-referent',
  canCollege,
  controller.removeReferentFromClass
)

router.route('/:id/isactive').put(canCollege, controller.toggleActive)

router.route('/:id/referent').put(canCollege, controller.addReferent)

router.route('/college/:college').get(controller.getClassFromCollege)

module.exports = router
