const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { TOKEN_EXPIRE_SEC } = require('../utils/config')

const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })

    if (!existingUser) {
        return res
            .status(400)
            .send({ error: `User with username ${username}, does not exist.` })
    }

    const passwordSame = await bcrypt.compare(
        password,
        existingUser.passwordHash,
    )

    if (!passwordSame) {
        return res.status(400).send({ error: 'Invalid password' })
    }

    const userToken = {
        username: existingUser.username,
        id: existingUser._id,
    }

    const token = jwt.sign(userToken, process.env.SECRET, {
        expiresIn: TOKEN_EXPIRE_SEC,
    })

    res.status(200).send({
        token,
        username: existingUser.username,
        name: existingUser.name,
    })
})

module.exports = loginRouter
