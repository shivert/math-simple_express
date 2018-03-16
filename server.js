const constants = require('./constants');

const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const simplifier = require('./simplifier')

let app = express()
app.use(bodyParser.json())
app.use(cors())

// Returns list of implemented boolean laws
app.get('/api/simplify/boolean/laws', (req, res) => {
    console.log("GET request received")

    fs.readFile(__dirname + '/data/boolean_laws.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(constants.INVALID_STATUS_CODE).json({'error': 'Invalid File Name'})
        }
        res.end(data)
    })
})

// Computes + returns simplified expression
// Current implementation computes the simplification each time
// The result is stored and the popularity score is incremented
app.post('/api/simplify/boolean/expressions', (req, res) => {
    console.log("POST request received")

    const original = req.body.expression
    const simplified = simplifier.simplifyBooleanExpression(original)
    simplifiedExpressionSaved = false

    fs.readFile(__dirname + '/data/pre-computed_expressions.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(constants.INVALID_STATUS_CODE).json({'error': 'Invalid File Name'})
        }
        try {
            let expressions = JSON.parse(data) // get JSON data from the file

            // If the expression is pre-computed, increase popularity score
            if (expressions[original]) {
                expressions[original].popularity = updatePopularityValue(expressions, original)
            } else {
                expressions[original] = setPopularityValue(expressions, original, simplified)
            }

            fs.writeFileSync(__dirname + '/data/pre-computed_expressions.json', JSON.stringify(expressions))
            simplifiedExpressionSaved = true
        } catch (err) {
            console.error(err)
        }
    })

    const jsonText = setJSONText(original, simplified, simplifiedExpressionSaved)

    res.end(jsonText)
})

// Returns list of pre-simplified expressions and their popularity score
app.get('/api/simplify/boolean/expressions', (req, res) => {
    console.log("GET request received")

    fs.readFile(__dirname + '/data/pre-computed_expressions.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(constants.INVALID_STATUS_CODE).json({'error': 'Invalid File Name'})
        }

        let expressions = JSON.parse(data) // get JSON data from the file

        // If query param is specified
        if (req.query.original && expressions[req.query.original]) {
            data = setData(true, req.query.original, expressions[req.query.original].simplified, expressions[req.query.original].popularity)
        } else if (req.query.original) {
            data = setData(false, req.query.original, '', constants.POPULARITY_SCORE_ZERO)
        }

        res.end(JSON.stringify(data))
    })
})

function setData(alreadySimplified, originalExpression, simplifiedExpression, popularity) {
    const data = {
        alreadySimplified: alreadySimplified,
        originalExpression:originalExpression,
        simplifiedExpression: simplifiedExpression,
        popularity: popularity
    }
    return data
}

function setPopularityValue(expressions, original, simplified) {
    expressions[original] = {
                simplified: simplified,                    
                popularity: constants.INCREMENTAL_POPULARITY_VALUE
            }
    return expressions[original]
}

function updatePopularityValue(expressions, original) {
     expressions[original].popularity += constants.INCREMENTAL_POPULARITY_VALUE
     return expressions[original].popularity
}

function setJSONText(original, simplified, simplifiedExpressionSaved) {
    const jsonText = JSON.stringify({
        originalExpression: original,
        simplifiedExpression: simplified,
        saveStatus: simplifiedExpressionSaved
    })
    return jsonText
}

app.listen(process.env.PORT || constants.PORT_4000)
