const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  address: {
    type: String, //string ?
    required: true
  },

  last_connection: String, //de l'entreprise

  registration: { type: Date, default: Date.now }, // date d'inscription des entreprises

  phone: String,

  picture: String
})

module.exports = mongoose.model('Company', companySchema, 'companies')
