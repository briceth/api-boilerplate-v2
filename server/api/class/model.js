const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = new Schema({
  name: {
    type: String,
    required: [true, 'un nom est requis']
  },

  date: { type: String, required: [true, 'une date est requise'] },

  is_active: { type: Boolean, default: true },

  college: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  referent: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Class', classSchema, 'classes')
