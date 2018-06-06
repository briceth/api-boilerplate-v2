const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('../../api/user/model')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
      session: false
    },
    function(req, username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) return done(err)
        if (user) return user.authenticate(password, done)

        const newUser = {}
        return done(null, newUser, { newUser: true })
      })
    }
  )
)

module.exports = passport
