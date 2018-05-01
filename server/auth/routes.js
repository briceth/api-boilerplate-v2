const config = require('../../config')
const express = require('express')
const router = express.Router()
const { handleResetPasswordErrors } = require('../middlewares/user')
const { checkLoggedIn } = require('../middlewares/core')
const controller = require('./controller')

router.post('/sign_up', controller.signUp)

router.post('/log_in', controller.logIn)

router.route('/email_check').get(controller.emailCheck)

router.route('/forgotten_password').post(controller.forgottenPassword)
router
  // const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), controller.resetPasswordGET)
  .post(handleResetPasswordErrors({}), controller.resetPasswordPOST)

module.exports = router
