const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('../../api/user/model')

function cbi(done, user) {
  return done(null, user)
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
      session: false
    },
    function(req, username, password, done) {
      console.log('BONJOUR')
      User.findOne({ email: username }, function(err, user) {
        if (err) return done(err)
        if (user) {
          console.log('HELLO')
          return user.authenticate(password, done)
        }

        const newUser = {}
        console.log('COUCOU')
        return done(null, newUser, { newUser: true })
      })
    }
  )
)

module.exports = passport
