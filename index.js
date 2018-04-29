const { app } = require('./server/server')
const config = require('./config')

const server = app.listen(config.PORT, () => {
  console.log(
    `API running on port ${
      config.PORT
    } | ${config.ENV.toUpperCase()} environnement | MONGO_URI: ${
      config.MONGODB_URI
    } \n`
  )
})

module.exports = server // for testing
