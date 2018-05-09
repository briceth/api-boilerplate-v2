const config = require('../../config')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary')
var cloudinaryStorage = require('multer-storage-cloudinary')
const uniqid = require('uniqid')

const { handleResetPasswordErrors } = require('../middlewares/user')
const { checkLoggedIn } = require('../middlewares/core')
const controller = require('./controller')

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
})
const storage = cloudinaryStorage({
  cloudinary: cloudinary, // configuration de cloudinary avec vos credentials
  folder: 'users', // nom du répertoire dans lequel les images vont arriver
  allowedFormats: ['jpg', 'png'], // types de fichiers acceptés
  transformation: [{ width: 200, height: 200, crop: 'thumb', gravity: 'face' }], // transformation
  filename: function(req, file, cb) {
    //console.log(file)
    cb(undefined, uniqid()) // génère un nom de fichier unique
  }
})
const parser = multer({ storage: storage })

router.post('/sign_up', controller.signUp)

router.post('/log_in', controller.logIn)

router.post('/upload_avatar', parser.single('image'), controller.uploadAvatar)

router.route('/email_check').get(controller.emailCheck)

router.route('/forgotten_password').post(controller.forgottenPassword)
// const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
router
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), controller.resetPasswordGET)
  .post(handleResetPasswordErrors({}), controller.resetPasswordPOST)

module.exports = router
