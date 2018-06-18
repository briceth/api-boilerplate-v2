const bodyParser = require('body-parser')
const compression = require('compression') // compress server responses in GZIP
const helmet = require('helmet') // protection package
const morgan = require('morgan')
const cors = require('cors') // to authorize request to the API from another domaine
const HTTPBearerStrategy = require('passport-http-bearer').Strategy // authorization bearer
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const config = require('../../config')
const User = require('../api/user/model')

module.exports = app => {
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  )
  app.use(bodyParser.json())
  app.use(compression())
  app.use(helmet())
  app.use('/api', cors())
  app.use('/auth', cors())
  app.use(passport.initialize())

  passport.use(new HTTPBearerStrategy(User.authenticateBearer()))

  passport.serializeUser(function(user, done) {
    done(null, user)
  })
  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
        session: false
      },
      User.authenticateLocal()
    )
  )
  // Pour toutes les requêtes vers les routes commençant par /api/*,
  // on vérifie que la requête a un token, si oui, on attache le user
  // correspondant à req.user, de là on pourra voir si il est admin et si c'est bien le bon user
  // parce que le problème avec le Token c'est que je peux prendre le token de qlq et m'amuser avec.
  // donc il faut aussi vérifier que l'id du user renvoyé par passport(req.user) match avec
  // le req.params.id ou req.body.id qui est demandé ou modifié.

  app.use(
    '/api/*',
    passport.authenticate('bearer', {
      session: false
    })
  )

  if (config.ENV !== 'test') {
    app.use(morgan('dev'))
  }
}
