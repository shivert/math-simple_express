const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const simplifier = require('./../simplifier')
const VerifyToken = require('./../auth/VerifyToken')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

var BooleanExpression = require('./../booleanExpression/booleanExpression')

// Simplify an expression
router.post('/boolean/expressions', VerifyToken, (req, res) => {

    // Attempt to retrieve pre-computed expression in database
    BooleanExpression.findOne({'expression': req.body.expression}, 'expression simplified popularity', (err, booleanExpression) => {

        // if boolean expression is found in database
        if (booleanExpression) {
            // Increment Popularity Score
            BooleanExpression.findByIdAndUpdate(
                booleanExpression.id,
                { popularity: booleanExpression.popularity + 1},
                (err) => {
                    if (err) return res.status(500).send("There was a problem incrementing the popularity score.")
                })

            res.status(200).send(booleanExpression)
        } else {
            // Simplify expression
            const original = req.body.expression
            const simplified = simplifier.simplifyBooleanExpression(original)

            BooleanExpression.create({
                expression : original,
                isSimplified : original === simplified,
                simplified : simplified,
                popularity: 1
            }, (err, booleanExpression) => {
                if (err) return res.status(500).send("There was a problem adding the information to the database.")
                res.status(200).send(booleanExpression)
            })
        }
    })
})

// Returns list of pre-simplified expressions and their popularity score
router.get('/boolean/expressions', VerifyToken, (req, res) => {

    BooleanExpression.findOne({'expression': req.query.original}, 'expression isSimplified simplified popularity', (err, booleanExpression) => {

        // if boolean expression is found in database
        if (booleanExpression) {
            res.status(200).send(booleanExpression)
        } else {

            const data = {
                isSimplified: false,
                expression: req.query.original,
                simplified: '',
                popularity: 0
            }
            res.status(200).send(data)
        }
    })
})

module.exports = router
