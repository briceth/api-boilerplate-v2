const express = require('express')
const router = express.Router()
const controlleur = require('./controlleur')

router.route('/').post(controller.create)

module.exports = router
