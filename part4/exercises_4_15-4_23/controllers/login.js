const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { TOKEN_EXPIRE_SEC, SECRET } = require('../utils/config')

const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    if (!(username && password)) {
        return res.status(400).json({ error: 'Missing username or password!' })
    }

    // check username existence
    const existingUser = await User.findOne({ username })

    if (!existingUser) {
        return res.status(401).json({ error: 'Invalid username or password' })
    }

    // compare password hashes
    const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash,
    )

    if (!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid username or password' })
    }

    // create user token payload
    const userToken = {
        username: existingUser.username,
        id: existingUser._id,
    }

    // create the token
    const token = jwt.sign(userToken, SECRET, {
        expiresIn: TOKEN_EXPIRE_SEC,
    })

    res.status(200).json({
        token,
        username: existingUser.username,
        name: existingUser.name,
    })
})

module.exports = loginRouter
