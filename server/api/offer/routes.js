const express = require('express')
const router = express.Router()
const controller = require('./controller')

router
  .route('/')
  .get(controller.all)
  .post(controller.create)

router
  .route('/:id')
  .put(controller.standBy)
  .delete(controller.delete)

module.exports = router
