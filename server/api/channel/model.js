const mongoose = require('mongoose')
const Schema = mongoose.Schema

const channelSchema = new Schema({
  name: {
    type: String,
    required: [true, 'un name est requis FDP']
  },

  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
})

module.exports = mongoose.model('Channel', channelSchema, 'channels')
