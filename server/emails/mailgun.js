const config = require('../../config')
const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN
})

// templates
const { mailPassword } = require('./sendPassword')
const { forgotPasswordEmail } = require('./forgotPasswordEmail')

module.exports = {
  sendPassword: async (url, user, password) => {
    try {
      const result = await mailgun
        .messages()
        .send(mailPassword(url, user, password))
      console.log('Mail body:', result)
    } catch (error) {
      console.error('Mail error:', error)
    }
  },
  forgotPassword: async (url, user) => {
    try {
      const result = await mailgun
        .messages()
        .send(forgotPasswordEmail(url, user))
      console.log('Mail body:', result)
    } catch (error) {
      console.error('Mail error:', error)
    }
  }
}
