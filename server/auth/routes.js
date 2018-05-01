const config = require('../../config')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary')
var cloudinaryStorage = require('multer-storage-cloudinary')
const uniqid = require('uniqid')

const { handleResetPasswordErrors } = require('../middlewares/user')
const { checkLoggedIn } = require('../middlewares/core')
const user_controller = require('./controller')

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

router.post('/sign_up', user_controller.sign_up)

router.post('/log_in', user_controller.log_in)

router.post(
  '/upload_avatar',
  parser.single('image'),
  user_controller.upload_avatar
)

router.route('/email_check').get(user_controller.email_check)

router.route('/forgotten_password').post(user_controller.forgotten_password)
router
  // const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), user_controller.reset_password_GET)
  .post(handleResetPasswordErrors({}), user_controller.reset_password_POST)

module.exports = router
