const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

const passportLocal = require('./strategies/local')
const passportFacebook = require('./strategies/facebook')
const passportGoogle = require('./strategies/google')

const controller = require('./controller')

// verify token
router.post('/verify_token', controller.verifyToken)

// signup
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

// login
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

// password
router.route('/forgot_password').post(controller.forgotPassword)
router.route('/reset_password').post(controller.resetPassword)

// upload
router.post('/upload', multipartMiddleware, controller.upload)
router.delete('/upload', controller.deleteUpload)

router.post('/upload', multipartMiddleware, controller.upload)
router.delete('/upload', controller.deleteUpload)

// others
router.route('/companies/all').get(controller.getAllCompanyNames)
router.route('/companies/add').post(controller.createCompany)

router.route('/colleges/all').get(controller.getAllCollegeNames)
//router.route('/email_check').get(controller.emailCheck)

module.exports = router
