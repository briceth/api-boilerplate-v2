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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
router.route('/:id/isactive').put(controller.toggleActive)

=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
router.route('/college/:id').get(controller.getClassFromCollege)

module.exports = router
