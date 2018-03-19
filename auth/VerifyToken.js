const jwt = require('jsonwebtoken')
const config = require('../config')
const constants = require('./../constants')

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token']
    if (!token)
        return res.status(constants.FORBIDDEN_STATUS_CODE).send({ auth: false, message: 'No token provided.' })
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(constants.INVALID_STATUS_CODE).send({ auth: false, message: 'Failed to authenticate token.' })
        // save to request for use in other routes in everything is good
        req.userId = decoded.id
        next()
    });
}

module.exports = verifyToken
