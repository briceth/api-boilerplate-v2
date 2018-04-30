const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = new Schema({
  name: {
    type: String,
    required: [true, 'un nom est requis']
  },

  is_active: { type: Boolean, default: true },

  college: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  referent: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Class', classSchema, 'classes')

//Profil Collège : Affichage des classes
