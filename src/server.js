const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const simplifier = require('./simplifier')

const BOOLEAN_LAWS = __dirname + './../data/boolean_laws.json'
const SIMPLIFIED_EXPRESSION_STORAGE = __dirname + '/../data/pre-computed_expressions.json'

let app = express()
app.use(bodyParser.json())

// Returns list of implemented boolean laws
app.get('/api/simplify/boolean/laws', (req, res) => {
    console.log("GET request received")

    fs.readFile(BOOLEAN_LAWS, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(500).json({'error': 'Invalid File Name'})
        }
         res.end(data)
    })
})

// Returns list of pre-computed simplifications
app.get('/api/simplify/boolean/expressions', (req, res) => {
    console.log("GET request received")

    fs.readFile(SIMPLIFIED_EXPRESSION_STORAGE, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(500).json({'error': 'Invalid File Name'})
        }
        res.end(data)
    })
})


// Computes + returns simplified expression
// Current implemenation computes new value everytime and stores the result if not yet already computed
app.post('/api/simplify/boolean/expressions', (req, res) => {
    console.log("POST request received")

    const expression = req.body.expression
    const simplifiedExpression = simplifier.simplifyBooleanExpression(expression)
    simplifiedExpressionSaved = false

    // No need to record expressions that can't be further simplified
    if (simplifiedExpression !== expression) {
        fs.readFile(SIMPLIFIED_EXPRESSION_STORAGE, 'utf8', (err, data) => {
            if (err && err.code === 'ENOENT') {
                console.error('Invalid filename provided')
                res.status(500).json({'error': 'Invalid File Name'})
            }
            try {
                let expressions = JSON.parse(data) // get JSON data from the file
                let newExpression = {
                    [expression]: simplifiedExpression
                }
                expressions = Object.assign(expressions, newExpression) // combine the results
                fs.writeFileSync(SIMPLIFIED_EXPRESSION_STORAGE, JSON.stringify(expressions));

            } catch (err) {
                simplifiedExpressionSaved = false
                console.error("Invalid service request")
            }
        })
    }

    const jsonText = JSON.stringify({
        expression: simplifiedExpression,
        expressionRecorded: simplifiedExpressionSaved
    })

    res.end(jsonText)
})

// Can an expression be further simplified?
app.post('/api/simplify/boolean/expression/simpler', (req, res) => {
    console.log("POST request received")

    const expression = req.body.expression
    const simplifiedExpression = simplifier.simplifyBooleanExpression(expression)

    res.status(200).json({"result": expression !== simplifiedExpression})
})

// Has an expression already been simplified?
app.post('/api/simplify/boolean/expressions/find', (req, res) => {
    console.log("POST request received")

    const expression = req.body.expression

    fs.readFile(SIMPLIFIED_EXPRESSION_STORAGE, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            console.error('Invalid filename provided')
            res.status(500).json({'error': 'Invalid File Name'})
        }

        const expressions = JSON.parse(data) // get JSON data from the file
        const preComputedExpression = expressions[expression]

        const jsonText = JSON.stringify({
            alreadySimplified: typeof(preComputedExpression) !== 'undefined',
            simplifiedExpression: preComputedExpression
        })

        res.end(jsonText)
    })
})

app.listen(process.env.PORT || 4000)
