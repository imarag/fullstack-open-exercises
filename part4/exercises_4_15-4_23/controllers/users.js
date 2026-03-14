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

userRouter.get('/:id', async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId)

    if (!user) {
        return res
            .status(404)
            .json({ error: `User with id ${userId} does not exist.` })
    }

    return res.status(200).json(user)
})

userRouter.post('/', async (req, res, next) => {
    const body = req.body
    const name = body?.name ? body.name : null
    const username = body?.username ? body.username : null
    const password = body?.password ? body.password : null

    if (!(username && password)) {
        return res.status(400).json({ error: 'Missing username or password!' })
    }

    if (password.length < 3) {
        return res.status(400).json({
            error: 'Password must be at least 3 characters long!',
        })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const userInDB = new User({ name, username, passwordHash })

    try {
        const savedUser = await userInDB.save()
        res.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

userRouter.delete('/:id', async (req, res) => {
    const userId = req.params.id
    const existingUser = await User.findById(userId)

    if (!existingUser) {
        return res
            .status(404)
            .json({ error: `User with id ${userId} does not exist.` })
    }

    await User.findByIdAndDelete(userId)
    res.status(200).json(existingUser)
})

userRouter.put('/:id', async (req, res, next) => {
    const userId = req.params.id
    const body = req.body
    const name = body?.name ? body.name : null
    const username = body?.username ? body.username : null
    const password = body?.password ? body.password : null

    const existingUser = await User.findById(userId)
    if (!existingUser) {
        return res
            .status(404)
            .json({ error: `User with id ${userId} does not exist.` })
    }

    if (password && password.length < 3) {
        return res
            .status(400)
            .json({ error: 'Password must be at least 3 characters long!' })
    }

    if (name) existingUser.name = name
    if (username) existingUser.username = username
    if (password)
        existingUser.passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    try {
        const updatedUser = await existingUser.save()
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter
