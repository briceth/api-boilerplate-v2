const config = require('../../config')
const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

const { handleResetPasswordErrors } = require('../middlewares/user')
const { checkLoggedIn } = require('../middlewares/core')
const controller = require('./controller')

// routes
router.post('/sign_up', controller.signUp)

router.post('/log_in', controller.logIn)

router.post('/upload', multipartMiddleware, controller.upload)
router.delete('/upload', controller.deleteUpload)

router.route('/email_check').get(controller.emailCheck)

router.route('/forgotten_password').post(controller.forgottenPassword)
// const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
router
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), controller.resetPasswordGET)
  .post(handleResetPasswordErrors({}), controller.resetPasswordPOST)

module.exports = router
