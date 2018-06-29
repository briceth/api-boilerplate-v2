const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['hiring', 'declined', 'pending'],
    default: 'pending',
    required: [true, 'un statut est requis']
  },

  //starts_at: { type: Date },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'un élève est requis']
  },

  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: [true, 'une offre est requise']
  }
})

module.exports = mongoose.model(
  'application',
  applicationSchema,
  'applications'
)
