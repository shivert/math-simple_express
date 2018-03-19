const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const VerifyToken = require('./../auth/VerifyToken')
const constants = require('./../constants')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

var BooleanExpression = require('./booleanExpression')



// RETURNS ALL THE BOOLEAN EXPRESSIONS IN THE DATABASE
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem finding the users.")
        res.status(constants.OK_STATUS_CODE).send(users)
    })
})

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', (req, res) => {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem finding the user.")
        if (!user) return res.status(constants.ERROR_STATUS_CODE).send("No user found.")
        res.status(constants.OK_STATUS_CODE).send(user)
    })
})

// DELETES A USER FROM THE DATABASE
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem deleting the user.")
        res.status(constants.OK_STATUS_CODE).send("User: " + user.name + " was deleted.")
    })
})

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem updating the user.")
        res.status(constants.OK_STATUS_CODE).send(user)
    })
})


module.exports = router