const express = require('express')
const router = express.Router()
const config = require('../../../config')
const controller = require('./controller')
const {
  handleResetPasswordErrors
} = require('../../middlewares/user')
const {
  canUser
} = require('../../middlewares/core')

// Controllers de developpement
router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router
  .route('/:id')
  .get(controller.getById)
  .put(controller.update)

// TODO: pq faire une route spéciale pour supprimer un user ?
router.route('/referent/:id').delete(controller.removeReferent)
router.route('/college/:id').delete(controller.removeCollege)

router.route('/type/:type').get(controller.getAllByType)

// Controllers de production
router.route('/:id').put(canUser, controller.update)
router.route('/first-connection/:id').put(canUser, controller.updateFirstConnection)

router
  .route('/college/:id/students')
  .get(canUser, controller.getStudentsFromCollege)

router.route('/college/:id/referents').get(canUser, controller.getReferentsFromCollege)

router.get('/referent/:id/students', canUser, controller.getStudentsFromReferent)

router.route('/referent/:id').delete(canUser, controller.removeReferent)

module.exports = router