const express = require('express')
const router = express.Router()

const config = require('../config')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const VerifyToken = require('./VerifyToken')

const User = require('../user/User')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8)

    User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        }, (err, user) => {
            if (err) return res.status(500).send("There was a problem registering the user.")

            // create a token
            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 300 // expires in 5 minutes
            })
            res.status(200).send({ auth: true, token: token })
        })
})


router.get('/me', VerifyToken, (req, res, next) => {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("No user found.")

        res.status(200).send(user)
    })
})


router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.')
        if (!user) return res.status(404).send('No user found.')
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 300 // expires in 5 minutes
        })
        res.status(200).send({ auth: true, token: token })
    })
})

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null })
})

module.exports = router
