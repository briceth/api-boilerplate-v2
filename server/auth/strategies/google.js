const passport = require('passport')
const GoogleTokenStrategy = require('passport-google-token').Strategy

const User = require('../../api/user/model')
const config = require('../../../config')

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ oauthID: profile.id }, (err, user) => {
        if (err) return done(err)
        if (user) return done(null, user)

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
