const { test, describe, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const { initialUsers, usersInDb } = require('./test_helper')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
    // delete all users
    await User.deleteMany({})

    for (let user of initialUsers) {
        await api.post('/api/users').send(user)
    }
})

describe('Test get', () => {
    test('many users', async () => {
        const res = await api.get('/api/users').expect(200)

        const users = res.body
        assert.strictEqual(users.length, initialUsers.length)
    })

    test('single user', async () => {
        const usersDB = await usersInDb()
        const firstUser = usersDB[0]

        const res = await api.get(`/api/users/${firstUser.id}`).expect(200)

        const user = res.body
        assert.strictEqual(user.name, firstUser.name)
    })

    test('user blogs are populated', async () => {
        const res = await api.get('/api/users').expect(200)

        const users = res.body
        const firstUser = users[0]
        const userBlogs = firstUser['blogs']
        userBlogs.forEach((blog) => {
            assert('url' in blog)
        })
    })
})

test('Test create user', async () => {
    const newUser = {
        name: 'newuser123',
        username: 'new user',
        password: '12345678',
    }
    const res = await api.post('/api/users').send(newUser).expect(201)
    const createdUser = res.body
    assert.strictEqual(createdUser.name, newUser.name)

    const res2 = await api.get('/api/users')
    const allUsers = res2.body
    assert.strictEqual(initialUsers.length + 1, allUsers.length)
})

describe('Test restriction', () => {
    test('Username and password must exist', async () => {
        const newUser = {
            name: 'newuser123',
            username: 'new user',
        }
        const usersBefore = await usersInDb()
        const res = await api.post('/api/users').send(newUser).expect(400)
        assert(res.body.error)
        const usersAfter = await usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('Username and password must have length >= 3', async () => {
        const newUser = {
            name: 'newuser123',
            username: 'new user',
            password: '12',
        }
        const usersBefore = await usersInDb()
        const res = await api.post('/api/users').send(newUser).expect(400)
        assert(res.body.error)
        const usersAfter = await usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('Username unique', async () => {
        const newUser = {
            username: initialUsers[0].username,
            password: '12345678',
        }
        const usersBefore = await usersInDb()
        const res = await api.post('/api/users').send(newUser).expect(400)
        assert(res.body.error)
        const usersAfter = await usersInDb()
        assert.strictEqual(usersBefore.length, usersAfter.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
