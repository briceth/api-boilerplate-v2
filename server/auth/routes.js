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

// cloudinary.uploader.upload(req.file.path, result => {
//   console.log('RESULT', result)
// })

const storageAvatar = cloudinaryStorage({
  cloudinary: cloudinary, // configuration de cloudinary avec vos credentials
  folder: 'users', // nom du répertoire dans lequel les images vont arriver
  allowedFormats: ['jpg', 'png'], // types de fichiers acceptés
  transformation: [{ width: 200, height: 200, crop: 'thumb', gravity: 'face' }], // transformation
  filename: function(req, file, cb) {
    //console.log(file)
    cb(undefined, uniqid()) // génère un nom de fichier unique
  }
})
const storageCorrespondenceBook = cloudinaryStorage({
  cloudinary: cloudinary, // configuration de cloudinary avec vos credentials
  folder: 'correpondence_book', // nom du répertoire dans lequel les images vont arriver
  allowedFormats: ['jpg', 'png'], // types de fichiers acceptés
  transformation: [{ width: 400, height: 600, crop: 'limit' }], // transformation
  filename: function(req, file, cb) {
    cb(undefined, uniqid()) // génère un nom de fichier unique
  }
})
const storageCV = cloudinaryStorage({
  cloudinary: cloudinary, // configuration de cloudinary avec vos credentials
  folder: 'cv', // nom du répertoire dans lequel les images vont arriver
  allowedFormats: ['pdf'], // types de fichiers acceptés
  format: 'png',
  filename: function(req, file, cb) {
    console.log(file)
    cb(undefined, uniqid()) // génère un nom de fichier unique
  }
})

const parserAvatar = multer({ storage: storageAvatar })
const parserCorrespondenceBook = multer({ storage: storageCorrespondenceBook })
const parserCV = multer({ storage: storageCV })

router.post('/sign_up', controller.signUp)

router.post('/log_in', controller.logIn)

router.post('/upload_avatar', parserAvatar.single('image'), controller.upload)
router.post(
  '/upload_correspondence_book',
  parserCorrespondenceBook.single('image'),
  controller.upload
)
router.post('/upload_cv', parserCV.single('image'), controller.upload)
router.delete('/delete_upload', controller.deleteUpload)

router.route('/email_check').get(controller.emailCheck)

router.route('/forgotten_password').post(controller.forgottenPassword)
router
  // const options = { emailPresenceInQuery: true, tokenPresenceInQuery: true };
  .route('/reset_password')
  .get(handleResetPasswordErrors({}), controller.resetPasswordGET)
  .post(handleResetPasswordErrors({}), controller.resetPasswordPOST)

module.exports = router
