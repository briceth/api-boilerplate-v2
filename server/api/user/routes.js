const express = require('express')
const router = express.Router()
const config = require('../../../config')
const controller = require('./controller')
const { handleResetPasswordErrors } = require('../../middlewares/user')
const { canUser } = require('../../middlewares/core')

// Controllers de developpement
router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router
  .route('/:id')
  .get(controller.getById)
  .put(controller.update)

// Controllers de production
router.put('/:id/iscreated', controller.updateCreated)

router.route('/referent/:id').delete(controller.removeReferent)
router.route('/college/:id').delete(controller.removeCollege)

router.route('/type/:type').get(controller.getAllByType)

router.route('/:id').put(canUser, controller.update)

router
  .route('/college/:id/students')
  .get(canUser, controller.getStudentsFromCollege)

router
  .route('/college/:id/referents')
  .get(canUser, controller.getReferentsFromCollege)

router.get(
  '/referent/:id/students',
  canUser,
  controller.getStudentsFromReferent
)

module.exports = router
