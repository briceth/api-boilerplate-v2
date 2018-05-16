const config = require('../../config')
const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()

const passport = require('passport')
const passportLocal = require('./strategies/local')
const passportFacebook = require('./strategies/facebook')
const passportGoogle = require('./strategies/google')

const { handleResetPasswordErrors } = require('../middlewares/user')
const { checkLoggedIn } = require('../middlewares/core')
const controller = require('./controller')

// routes
// TODO: vérifier dans le signup si l'utilisateur n'est pas déjà inscrit
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

router.route('/email_check').get(controller.emailCheck)

router.route('/forgotten_password').post(controller.forgottenPassword)
// const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
router
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), controller.resetPasswordGET)
  .post(handleResetPasswordErrors({}), controller.resetPasswordPOST)

module.exports = router
