const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  shortId: Number, // shortId is useful when seeding data, it facilitates associations

  email: String,

  emailCheck: {
    valid: { type: Boolean, default: false },
    token: String,
    createdAt: Date
  },

  passwordChange: {
    valid: { type: Boolean, default: true },
    token: String,
    createdAt: Date
  },

  // Here`account` is for public information
  account: {
    first_name: String,
    last_name: String,
    type: {
      type: String,
      enum: ['school', 'student', 'hr', 'company', 'administrator', 'referring']
    }
  },
  //à voir is c'est util
  isReferring: { type: Boolean, default: false },

  password: String,

  token: String, // Le token permettra d'authentifier l'utilisateur à l'aide du package `passport-http-bearer`

  phone: String,

  picture: String,

  school: String, //nom du collège

  registration: { type: Date, default: Date.now } // date d'inscription des entreprises
})

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Authentification will use `email` instead of `username`
  session: false // no session in API
})

// Cette méthode sera utilisée par la strategie `passport-local` pour trouver un utilisateur en fonction de son `email` et `password`
UserSchema.statics.authenticateLocal = function() {
  const _self = this
  return function(req, email, password, cb) {
    _self.findByUsername(email, true, function(err, user) {
      if (err) return cb(err)
      if (user) {
        return user.authenticate(password, cb)
      } else {
        return cb(null, false)
      }
    })
  }
}

// Cette méthode sera utilisée par la strategie `passport-http-bearer` pour trouver un utilisateur en fonction de son `token`
UserSchema.statics.authenticateBearer = function() {
  const _self = this
  return function(token, cb) {
    if (!token) {
      cb(null, false)
    } else {
      _self.findOne({ token: token }, function(err, user) {
        if (err) return cb(err)
        if (!user) return cb(null, false)
        return cb(null, user)
      })
    }
  }
}

module.exports = mongoose.model('User', UserSchema, 'users')
