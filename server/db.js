const mongoose = require('mongoose')
const config = require('../config')

exports.connect = () => {
  return mongoose.connect(config.MONGODB_URI, err => {
    if (err) console.error('Could not connect to mongodb.')
  })
}

exports.mongooseDisconnect = () => {
  return mongoose.connection.close()
}
