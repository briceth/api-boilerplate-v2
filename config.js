require('dotenv').config() // allows to define env varibles in .env file
const ENV = process.env.NODE_ENV || 'development'

const config = {
  ENV,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,

  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
}

switch (ENV) {
  case 'development':
  case 'dev':
    config.PORT = parseInt(process.env.APP_PORT_DEV)
    config.MONGODB_URI = 'mongodb://localhost/api-vvmt-dev'
    break

  case 'test':
    config.PORT = parseInt(process.env.APP_PORT_TEST)
    config.MONGODB_URI = 'mongodb://localhost/api-vvmt-test'
    break

  case 'staging':
  case 'prod':
    config.PORT = parseInt(process.env.PORT)
    config.MONGODB_URI = process.env.MONGODB_URI
    break

  case 'production':
  case 'prod':
    config.PORT = parseInt(process.env.PORT)
    config.MONGODB_URI = process.env.MONGODB_URI
    break

  default:
    console.error(
      `${env} is not a recognized NODE_ENV (only development, test and production are accepted) ‼️ 😱 `
    )
}

module.exports = config
