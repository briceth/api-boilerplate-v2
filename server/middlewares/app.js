const bodyParser = require('body-parser')
const compression = require('compression') // compress server responses in GZIP
const helmet = require('helmet') // protection package
const morgan = require('morgan')
const log4js = require('log4js') // log http
const cors = require('cors') // to authorize request to the API from another domaine
const HTTPBearerStrategy = require('passport-http-bearer').Strategy // authorization bearer
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const config = require('../../config')
const User = require('../api/user/model')



module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(compression())
  app.use(helmet())
  app.use('/api', cors())
  app.use('/auth', cors())
  app.use(passport.initialize())
  passport.use(new HTTPBearerStrategy(User.authenticateBearer()))

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
  //app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }))
  if (config.ENV !== 'test') {
    app.use(morgan('dev'))
 }
}
