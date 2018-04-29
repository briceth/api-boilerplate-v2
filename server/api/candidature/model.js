const mongoose = require('mongoose')

const candidatureSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    enum: ['hiring', 'declined', 'pending']
  },

  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
