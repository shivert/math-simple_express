const jwt = require('jsonwebtoken')
const config = require('../config')

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' })
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' })

        // save to request for use in other routes in everything is good
        req.userId = decoded.id
        next()
    })
}

module.exports = verifyToken
