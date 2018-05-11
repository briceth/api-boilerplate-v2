const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.route('/').post(controller.create)

router.route('/students/:id').get(controller.getApplicationsFromStudent)

router
  .route('/:id')
  .put(controller.update)
  .delete(controller.delete)

module.exports = router
