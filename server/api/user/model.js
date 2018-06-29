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
    unique: true,
    required: true,
    dropDups: true
  },

  passwordChange: {
    token: {
      type: String,
      default: uid2(24)
    },
    expiryDate: Date
  },

  token: {
    type: String,
    default: uid2(32)
  }, // Token created with uid2. Will be used for Bear strategy. Should be regenerated when password is changed.

  // student, pro, hr, referent
  account: {
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

    diary_picture: {
      type: String,
      required: [
        function() {
          return ['student'].includes(this.account.type)
        },
        'une photo du carnet de correspondance est requise'
      ]
    }, // student

    motivation_letter: String, // student

    curriculum: String, // student

    // student, pro, referent, college, hr, administrator
    first_connection: {
      type: Date,
      required: true,
      default: Date.now()
    },

    last_connection: String, // pro

    type: {
      type: String,
      required: true,
      enum: ['college', 'student', 'hr', 'pro', 'administrator', 'referent']
    },

    // student, referent
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [
        function() {
          return ['student', 'referent'].includes(this.account.type)
        },
        'un collège est requis'
      ]
    },

    // Visualisation de tous les élèves d'une classe
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class'
    }, // student (optionnel)

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
    }
  }
})

const errorMessages = {
  MissingPasswordError: 'Mot de passe manquant',
  MissingUsernameError: 'Email manquant',
  IncorrectPasswordError: 'Mot de passe ou email invalide',
  IncorrectUsernameError: 'Mot de passe ou email invalide',
  UserExistsError: 'Un utilisateur avec cet email existe déjà'
}

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Authentification will use `email` instead of `username`
  session: false, // no session in API
  errorMessages
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
