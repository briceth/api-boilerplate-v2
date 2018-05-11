const express = require('express')
const router = express.Router()
const config = require('../../../config')
const { handleResetPasswordErrors } = require('../../middlewares/user')
const { checkLoggedIn } = require('../../middlewares/core')
const controller = require('./controller')

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router.route('/:id').put(controller.update)

router.route('/type/:type').get(controller.getAllByType)

router
  .route('/college/:id/students')
  .get(controller.getStudentsFromCollege)

router
  .route('/college/:id/referents')
  .get(controller.getReferentsFromCollege)

// L'authentification est obligatoire pour cette route
//router.get('/:id', checkLoggedIn, controller.initial_get_user)
module.exports = router
