const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

const passportLocal = require('./strategies/local')
const passportFacebook = require('./strategies/facebook')
const passportGoogle = require('./strategies/google')

const controller = require('./controller')

// routes
router.post('/verify_token', controller.verifyToken)

router.post('/sign_up', controller.signUp)
router.post(
  '/sign_up_facebook',
  passportFacebook.authenticate('facebook-token', { session: false }),
  controller.signUp
)
router.post(
  '/sign_up_google',
  passportGoogle.authenticate('google-token', { session: false }),
  controller.signUp
)

router.post('/log_in', passportLocal.authenticate('local'), controller.logIn)
router.post(
  '/log_in_facebook',
  passportFacebook.authenticate('facebook-token', { session: false }),
  controller.logIn
)
router.post(
  '/log_in_google',
  passportGoogle.authenticate('google-token', { session: false }),
  controller.logIn
)

router.post('/upload', multipartMiddleware, controller.upload)
router.delete('/upload', controller.deleteUpload)

router.post('/forgot_password', controller.forgotPassword)
router.post('/reset_password', controller.resetPassword)

//router.route('/email_check').get(controller.emailCheck)

module.exports = router
