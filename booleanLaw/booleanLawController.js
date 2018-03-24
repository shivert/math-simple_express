const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const VerifyToken = require('./../auth/VerifyToken')
const constants = require('./../constants')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

var BooleanLaw = require('./booleanLaw')

// RETURNS ALL THE BOOLEAN LAWS FROM THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    BooleanLaw.find({}, (err, booleanLaws) => {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem finding the Boolean Laws.")
        res.status(constants.OK_STATUS_CODE).send(booleanLaws)
    })
})

// CREATES A LAW
router.post('/', VerifyToken, (req, res) => {
    BooleanLaw.create({
        name : req.body.name,
        rules : [req.body.rule1]
    }, (err, booleanLaw) => {
        if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem adding the information to the database.")
        res.status(constants.OK_STATUS_CODE).send(booleanLaw)
    })
})

module.exports = router
