const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { canUser } = require('../../middlewares/core')

router
  .route('/')
  .get(controller.getAll)
  .post(controller.create)

router
  .route('/:id')
  .get(controller.getOne)
  .put(controller.toggleActive)
  .delete(controller.delete)

router.route('/student/:id').get(canUser, controller.getAllByLoc)

module.exports = router
