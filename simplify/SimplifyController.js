const express = require('express')
const router = express.Router()
const constants = require('./../constants')

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
            incrementPopularityScore(booleanExpression)
            res.status(constants.OK_STATUS_CODE).send(booleanExpression)
        } else {
            // Simplify expression
            const original = req.body.expression
            const simplified = simplifier.simplifyBooleanExpression(original)

            BooleanExpression.create({
                expression : original,
                isSimplified : original === simplified,
                simplified : simplified,
                popularity: constants.INCREMENTAL_POPULARITY_VALUE
            }, (err, booleanExpression) => {
                if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem adding the information to the database.")
                res.status(constants.OK_STATUS_CODE).send(booleanExpression)
            })
        }
    })
})

// Returns list of pre-simplified expressions and their popularity score
router.get('/boolean/expressions', VerifyToken, (req, res) => {

    BooleanExpression.findOne({'expression': req.query.original}, 'expression isSimplified simplified popularity', (err, booleanExpression) => {

        // if boolean expression is found in database
        if (booleanExpression) {
            res.status(constants.OK_STATUS_CODE).send(booleanExpression)
        } else {
            const data = setData(false, req.query.original, '', constants.POPULARITY_SCORE_ZERO)
            res.status(constants.OK_STATUS_CODE).send(data)
        }
    })
})

function incrementPopularityScore(booleanExpression) {
    BooleanExpression.findByIdAndUpdate(
        booleanExpression.id,
        { popularity: booleanExpression.popularity + constants.INCREMENTAL_POPULARITY_VALUE},
        (err) => {
            if (err) return res.status(constants.INVALID_STATUS_CODE).send("There was a problem incrementing the popularity score.")
    })
}

function setData(isSimplified, expression, simplified, popularity) {
    const data = {
            isSimplified: isSimplified,
            expression: expression,
            simplified: simplified,
            popularity: popularity
        }
    return data
}

module.exports = router
