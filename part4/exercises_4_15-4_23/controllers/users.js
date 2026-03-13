const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('../utils/config')

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {
        url: 1,
        title: 1,
        author: 1,
        id: 1,
    })
    res.status(200).json(users)
})

userRouter.post('/', async (req, res) => {
    const { name, username, password } = req.body

    if (!password) {
        return res.status(400).json({ error: 'Missing password!' })
    }

    if (!password.length >= 3) {
        return res.status(400).json({
            error: 'Password must be at least 3 characters long!',
        })
    }

    // added token validation in middleware

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const userDB = new User({ name, username, passwordHash })
    const savedUser = await userDB.save()
    res.status(201).json(savedUser)
})

userRouter.delete('/:id', async (req, res) => {
    const userId = req.params.id
    const existingUser = await User.findById(userId)
    if (!existingUser) {
        return res
            .status(404)
            .json({ error: `There is no user with id ${userId}` })
    }

    await User.deleteOne({ _id: userId })
    res.status(200).json(existingUser)
})

userRouter.put('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id

        const { name, username, password } = req.body

        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return res
                .status(404)
                .json({ error: `There is no user with id ${userId}` })
        }

        if (name) existingUser.name = name
        if (username) existingUser.username = username

        if (password) {
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
            existingUser.passwordHash = passwordHash
        }
        const updatedUser = await existingUser.save()
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter
