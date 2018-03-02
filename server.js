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
            res.status(500).json({'error': 'Invalid File Name'})
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
            res.status(500).json({'error': 'Invalid File Name'})
        }
        try {
            let expressions = JSON.parse(data) // get JSON data from the file

            // If the expression is pre-computed, increase popularity score
            if (expressions[original]) {
                expressions[original].popularity += 1
            } else {
                expressions[original] = {
                    simplified: simplified,
                    popularity: 1
                }
            }

            fs.writeFileSync(__dirname + '/data/pre-computed_expressions.json', JSON.stringify(expressions))
            simplifiedExpressionSaved = true
        } catch (err) {
            console.error(err)
        }
    })

    const jsonText = JSON.stringify({
        originalExpression: original,
        simplifiedExpression: simplified,
        saveStatus: simplifiedExpressionSaved
    })

    res.end(jsonText)
})

// Returns list of pre-simplified expressions and their popularity score
app.get('/api/simplify/boolean/expressions', (req, res) => {
    console.log("GET request received")

    fs.readFile(__dirname + '/data/pre-computed_expressions.json', 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(500).json({'error': 'Invalid File Name'})
        }

        let expressions = JSON.parse(data) // get JSON data from the file

        // If query param is specified
        if (req.query.original && expressions[req.query.original]) {
            data = {
                alreadySimplified: true,
                originalExpression: req.query.original,
                simplifiedExpression: expressions[req.query.original].simplified,
                popularity: expressions[req.query.original].popularity
            }

        } else if (req.query.original) {
            data = {
                alreadySimplified: false,
                originalExpression: req.query.original,
                simplifiedExpression: '',
                popularity: 0
            }
        }

        res.end(JSON.stringify(data))
    })
})

app.listen(process.env.PORT || 4000)
