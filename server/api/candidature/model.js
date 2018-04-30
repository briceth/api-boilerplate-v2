const mongoose = require('mongoose')

const candidatureSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['hiring', 'declined', 'pending']
  },

  startsAt: { type: Date, default: Date.now },

  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }
})

module.exports = mongoose.model(
  'Candidature',
  candidatureSchema,
  'candidatures'
)

// - company
//nombre candidats embauchés
//nombre de candidats en attente

// - élèves
//nombre de candidatures
//candidature accepté
