const express = require('express')
const app = express()
const db = require('./db')
const cors = require('cors')

app.use(cors())

const UserController = require('./user/UserController')
app.use('/users', UserController)

const AuthController = require('./auth/AuthController')
app.use('/api/auth', AuthController)

const BooleanLawController = require('./booleanLaw/BooleanLawController')
app.use('/api/boolean-law', BooleanLawController)

const SimplifyController = require('./simplify/SimplifyController')
app.use('/api/simplify', SimplifyController)

module.exports = app
