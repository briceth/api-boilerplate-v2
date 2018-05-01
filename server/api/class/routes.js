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

module.exports = router
