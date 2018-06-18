const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { canUser } = require('../../middlewares/core')

router.route('/').post(controller.create)

router
  .route('/students/:id')
  .get(canUser, controller.getApplicationsFromStudent)

router
  .route('/:id')
  .put(canUser, controller.update)
  .delete(canUser, controller.delete)

module.exports = router
