const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/jwt')
const { SECRET } = require('../utils/config')

const userExtractor = async (req, res, next) => {
    if (req.method.toUpperCase() === 'GET') {
        return next()
    }
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    req.user = decodedToken.id
    next()
}

const tokenExtractor = (req, res, next) => {
    if (req.path === '/api/login' || req.method.toUpperCase() === 'GET') {
        return next()
    }

    try {
        const token = getTokenFrom(req)

        if (!token) {
            return res.status(401).json({ error: 'token missing' })
        }

        const decodedToken = jwt.verify(token, SECRET)

        req.user = decodedToken

        next()
    } catch (error) {
        next(error)
    }
}

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('Authorization: ', req.get('Authorization'))
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (
        error.name === 'MongoServerError' &&
        error.message.includes('E11000 duplicate key error')
    ) {
        return res
            .status(400)
            .json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' })
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'token expired',
        })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
}
