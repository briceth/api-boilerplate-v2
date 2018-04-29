const express = require('express')
const router = express.Router()
const config = require('../../../config')
const { handleResetPasswordErrors } = require('../../middlewares/user')
const { checkLoggedIn } = require('../../middlewares/core')
const controller = require('./controller')

// L'authentification est obligatoire pour cette route
router.get('/:id', checkLoggedIn, controller.initial_get_user)

module.exports = router
