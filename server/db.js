const mongoose = require('mongoose')
const config = require('../config')

exports.connect = () => {
  return mongoose.connect(
    config.MONGODB_URI,
    error => {
      if (error) console.error('Could not connect to mongodb...💩 💩', error)
    }
  )
}

exports.mongooseDisconnect = () => {
  return mongoose.connection.close()
}
