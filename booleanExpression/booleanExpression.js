const mongoose = require('mongoose')

const BooleanExpressionSchema = new mongoose.Schema({
  expression: String,
  isSimplified: Boolean,
  simplified: String,
  popularity: Number
})

mongoose.model('BooleanExpression', BooleanExpressionSchema)

module.exports = mongoose.model('BooleanExpression')
