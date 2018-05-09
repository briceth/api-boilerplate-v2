const express = require('express')
const router = express.Router()
const controller = require('./controller')

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router
  .route('/:id')
  .put(controller.addStudent)
  .delete(controller.delete)

router.route('/:id/isactive').put(controller.toggleActive)

router.route('/college/:id').get(controller.getClassFromCollege)

router.route('/college/:id').get(controller.getClassFromCollege)

router.route('/:id/isactive').put(controller.toggleActive)

router.route('/:id/add-referent').put(controller.addReferent)


module.exports = router
