const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const uid2 = require('uid2')

const UserSchema = new mongoose.Schema({
  oauthID: String,

  shortId: Number, // shortId is useful when seeding data, it facilitates associations

  email: String,

  emailCheck: {
    valid: { type: Boolean, default: true }, // change to false to activate emailCheck
    token: { type: String, default: uid2(20) },
    createdAt: { type: Date, default: Date.now }
  },

  //password: String, //A supprimer

  passwordChange: {
    valid: { type: Boolean, default: true },
    token: String,
    createdAt: Date
  },

  token: { type: String, default: uid2(32) }, // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.}

  //token: String, // Le token permettra d'authentifier l'utilisateur à l'aide du package `passport-http-bearer`

  account: {
    // student, pro, hr, referent
    first_name: {
      type: String
      // required: [
      //   function() {
      //     return this.account.type === 'student' || 'pro' || 'hr' || 'referent'
      //   },
      //   'un prénom est requis'
      // ]
    },

    // student, pro, hr, referent
    last_name: {
      type: String
      // required: [
      //   function() {
      //     return this.account.type === 'student' || 'pro' || 'hr' || 'referent'
      //   },
      //   'un nom de famille est requis'
      // ]
    },

    // student, pro
    address: {
      type: String
      // required: [
      //   function() {
      //     return this.account.type === 'student' || 'pro'
      //   },
      //   'une adresse est requise'
      // ]
    },

    // student, pro
    loc: {
      type: [Number], // Array : longitude et latitude
      index: '2d'
    },

    // college
    city: {
      type: String
      // required: [
      //   function() {
      //     return this.account.type === 'college', 'une ville est requise'
      //   }
      // ]
    },

    // college, pro, rh,
    phone: {
      type: String
      // required: [
      //   function() return this.type === 'college' || 'pro' || 'rh',
      //   'une numéro de téléphone requis'
      // ]
    },

    picture: String, // student

    // college
    college_name: {
      type: String
      // required: [
      //   function() {
      //     return this.account.type === 'college', 'un nom est requis'
      //   }
      // ]
    },

    is_active: Boolean, // student, hr

    diary_picture: String, // student

    motivation_letter: String, // student

    curriculum: String, // student

    last_connection: String, // pro

    type: {
      type: String,
      enum: ['college', 'student', 'hr', 'pro', 'administrator', 'referent']
    },
    // Visualisation de tous les élèves d'une classe
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, //student, referent

    // Visualisation de tous les élèves d'un collège avec les informations principales
    // Ratacher des élèves à un collège
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // student, referent

    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // pro, hr
  }
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
      _self.findOne({ token }, function(err, user) {
        if (err) return cb(err)
        if (!user) return cb(null, false)
        return cb(null, user)
      })
    }
  }
}

module.exports = mongoose.model('User', UserSchema, 'users')
