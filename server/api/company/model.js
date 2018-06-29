const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    dropDups: true
  },

  industry: { type: String, required: true },

  logo: String
})

module.exports = mongoose.model('Company', companySchema, 'companies')
