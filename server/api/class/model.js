const mongoose = require('mongoose')
const Schema = mongoose.Schema

const classSchema = new Schema({
  name: {
    type: String,
    required: [true, 'un name est requis']
  },

  status: { type: String, enum: ['active', 'standby'], default: 'active' },

  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  reffering: { type: Schema.Types.ObjectId, ref: 'User' },

  school: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Class', classSchema, 'classes')

//Profil Collège : Affichage des classes
