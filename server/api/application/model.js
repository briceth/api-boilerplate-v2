const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['hiring', 'declined', 'pending'],
    required: true
  },

  starts_at: { type: Date },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  }
})

module.exports = mongoose.model(
  'application',
  applicationSchema,
  'applications'
)

// - company
//nombre candidats embauchés
//nombre de candidats en attente

// - élèves
//nombre de candidatures
//candidature accepté
