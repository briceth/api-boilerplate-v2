const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')

const User = require('../../api/user/model')
const config = require('../../../config')

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ oauthID: profile.id }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, user, { registered: true })

        const newUser = {
          oauthID: profile.id,
          email: profile.emails[0].value,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName
        }
        return done(null, newUser, { newUser: true })
      })
    }
  )
)

module.exports = passport
