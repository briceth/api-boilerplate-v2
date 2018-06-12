const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  //TODO: add loc ?
  // idem in seed

  starts_at: {
    type: Date,
    required: true
  },

  end_at: {
    type: Date,
    required: true
  },

  profession: {
    type: String,
    required: true
  },

  number_application: {
    type: Number,
    default: 10,
    required: true
  },

  is_active: { type: Boolean, default: true, required: true },

  is_favorite: { type: Boolean, default: false, required: true },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },

  pro: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Offer', offerSchema, 'offers')
