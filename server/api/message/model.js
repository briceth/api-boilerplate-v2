const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  type: {
    type: String,
    enum: ['motivation', 'message', 'refusal']
  },

  //ça sert à rien d'en avoir deux

  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },

  date: { type: Date, default: Date.now },

  files: [String]
})

module.exports = mongoose.model('Message', messageSchema, 'messages')

// features intéressantes
// Possibilité pour le référent de répondre aux messages par email
