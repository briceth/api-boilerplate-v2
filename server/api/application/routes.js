const express = require('express')
const router = express.Router()
const controller = require('./controller')

router.route('/').post(controller.create)

router
  .route('/:id')
  .put(controller.update)
  .delete(controller.delete)

module.exports = router
