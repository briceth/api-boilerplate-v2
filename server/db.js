const mongoose = require('mongoose')
const chalk = require('chalk')
const config = require('../config')
const logError = console.error
const log = console.log

exports.connect = () => {
  return mongoose.connect(config.MONGODB_URI).then(
    () => {
      log(chalk.yellow('mongoose is connected...'))
    },
    error => {
      error && logError('Could not connect to mongodb... 💩 💩', error.message)
    }
  )
}

exports.mongooseDisconnect = () => {
  return mongoose.connection.close(() => log(chalk.yellow('close connection.')))
}
