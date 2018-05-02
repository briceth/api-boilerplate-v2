require('dotenv').config() // allows to define env varibles in .env file
const env = process.env.NODE_ENV || 'development'

const config = {
  ENV: env,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET
}

switch (env) {
  case 'development':
    config.PORT = parseInt(process.env.DEV_APP_PORT) || 3100
    config.MONGODB_URI = 'mongodb://localhost/api-vvmt-dev'
    break

  case 'test':
    config.PORT = parseInt(process.env.TEST_APP_PORT) || 3101
    config.MONGODB_URI = 'mongodb://localhost/api-vvmt-test'
    break

  case 'production':
    config.PORT = parseInt(process.env.PORT)
    config.MONGODB_URI = process.env.PROD_MONGODB_URI
    break

  default:
    console.error(
      `${env} is not a recognized NODE_ENV (only development, test and production are accepted)`
    )
}

module.exports = config
