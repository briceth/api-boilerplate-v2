const express = require('express')
const router = express.Router()
const controller = require('./controller')
const {
  canUser
} = require('../../middlewares/core')

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router.put('/:id/remove-referent', controller.removeReferentFromClass)

router
  .route('/:id')
  .put(controller.addStudent)
  .delete(controller.delete)

router.route('/:id/isactive').put(controller.toggleActive)

router.route('/college/:id').get(controller.getClassFromCollege)

router.route('/:id/referent').put(controller.addReferent)

//router.route('/:id/remove-referent').put(controller.removeReferent)


module.exports = router