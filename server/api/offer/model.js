const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },
  // address: {
  //   type: String, //string ?
  //   required: true
  // },
  startAt: {
    type: Date,
    required: true
  },

  endAt: {
    type: Date,
    required: true
  },

  // le métier
  trade: {
    type: String,
    required: true
  },

  industry: {
    type: String,
    required: true
  },

  number_application: {
    type: Number,
    default: 10
  },

  isActive: { type: Boolean, default: true },

  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Offer', offerSchema, 'offers')
