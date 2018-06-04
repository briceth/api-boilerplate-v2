const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const uid2 = require('uid2')

const UserSchema = new mongoose.Schema({
  oauthID: String,

  shortId: Number, // shortId is useful when seeding data, it facilitates associations

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    dropDups: true
  },

  // emailCheck: {
  //   valid: {
  //     type: Boolean,
  //     default: true
  //   }, // change to false to activate emailCheck
  //   token: {
  //     type: String,
  //     default: uid2(20)
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now
  //   }
  // },

  //password: String, //A supprimer

  passwordChange: {
    token: String,
    expiryDate: Date
  },

  token: {
    type: String,
    default: uid2(32)
  }, // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.}

  //token: String, // Le token permettra d'authentifier l'utilisateur à l'aide du package `passport-http-bearer`

  account: {
    // student, pro, hr, referent
    first_name: {
      type: String,
      trim: true,
      required: [
        function() {
          return ['student', 'pro', 'hr', 'referent'].includes(
            this.account.type
          )
        },
        'un prénom est requis'
      ]
    },

    // student, pro, hr, referent
    last_name: {
      type: String,
      trim: true,
      required: [
        function() {
          return ['student', 'pro', 'hr', 'referent'].includes(
            this.account.type
          )
        },
        'un nom de famille est requis'
      ]
    },

    // student, pro
    address: {
      type: String,
      trim: true,
      required: [
        function() {
          return ['student', 'pro'].includes(this.account.type)
        },
        'une adresse est requise'
      ]
    },

    // student, pro
    loc: {
      type: [Number], // Array : longitude et latitude
      index: '2d',
      required: [
        function() {
          return ['student', 'pro'].includes(this.account.type)
        },
        'une géolocalisation est requise'
      ]
    },

    // college
    city: {
      type: String,
      required: [
        function() {
          return ['college'].includes(this.account.type)
        },
        'une ville est requise'
      ]
    },

    // college, pro, hr,
    phone: {
      type: String,
      required: [
        function() {
          return ['college', 'pro', 'hr'].includes(this.account.type)
        },
        'un numéro de téléphone est requis'
      ]
    },

    picture: String, // student

    // all
    color: {
      type: String,
      required: true,
      default: () => {
        const colors = ['#ef4c31', '#fcb315', '#413091', '#b22672']
        return colors[Math.floor(Math.random() * colors.length)]
      }
    },

    // college
    college_name: {
      type: String,
      trim: true,
      required: [
        function() {
          return ['college'].includes(this.account.type)
        },
        'un nom de collège est requis'
      ]
    },

    // student, hr
    is_active: {
      type: Boolean,
      default: false,
      required: [
        function() {
          return ['student', 'hr'].includes(this.account.type)
        },
        "un indicateur d'activité est requis"
      ]
    },

    diary_picture: String, // student

    motivation_letter: String, // student

    curriculum: String, // student

    // student, pro, referent, college, hr, administrator
    first_connection: {
      type: Boolean,
      default: true
    },

    last_connection: String, // pro

    type: {
      type: String,
      required: true,
      enum: ['college', 'student', 'hr', 'pro', 'administrator', 'referent']
    },

    // Visualisation de tous les élèves d'une classe
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }, // student, referent

    // TODO: student, referent
    // Visualisation de tous les élèves d'un collège avec les informations principales
    // Ratacher des élèves à un collège
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // pro, hr
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [
        function() {
          return ['pro', 'hr'].includes(this.account.type)
        },
        'une société est requise'
      ]
    },

    // referent
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
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
      _self.findOne(
        {
          token
        },
        function(err, user) {
          if (err) return cb(err)
          if (!user) return cb(null, false)
          return cb(null, user)
        }
      )
    }
  }
}

module.exports = mongoose.model('User', UserSchema, 'users')
