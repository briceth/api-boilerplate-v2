const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false,
    required: true
  },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: { type: Date, default: Date.now, required: true },

  files: [String]
})

module.exports = mongoose.model('Message', messageSchema, 'messages')

// features intéressantes
// Possibilité pour le référent de répondre aux messages par email
