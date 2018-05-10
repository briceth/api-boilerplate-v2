const config = require('../../config')
const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN
})
const { mailPassword } = require('./sendPassword')
const log = console.log
const error = console.error

module.exports = {
  sendPassword: async (url, user, password) => {
      try {
        const result = await mailgun
          .messages()
          .send(mailPassword(url, user, password))
        log('Mail body:', result)
      } catch (error) {
        error('Mail error:', error)
      }
  }
}