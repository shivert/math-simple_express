const mongoose = require('mongoose')

const BooleanLawSchema = new mongoose.Schema({
  name: String,
  rules: [{type: String}]
})

mongoose.model('BooleanLaw', BooleanLawSchema)

module.exports = mongoose.model('BooleanLaw')
