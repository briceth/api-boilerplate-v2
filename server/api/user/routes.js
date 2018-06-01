const express = require('express')
const router = express.Router()
const config = require('../../../config')
const controller = require('./controller')
const { handleResetPasswordErrors } = require('../../middlewares/user')
const { checkLoggedIn } = require('../../middlewares/core')

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

router
  .route('/college/:id/students')
  ///.get(controller.getStudentsFromCollege)
  .get(controller.getStudentsFromCollege('college'))

router.route('/college/:id/referents').get(controller.getReferentsFromCollege)

router.get('/referent/:id/students', controller.getStudentsFromReferent)

// L'authentification est obligatoire pour cette route
//router.get('/:id', checkLoggedIn, controller.initial_get_user)
module.exports = router
