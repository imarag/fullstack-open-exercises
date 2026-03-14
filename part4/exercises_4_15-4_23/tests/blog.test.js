const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb, initialUsers } = require('./test_helper')
const assert = require('node:assert')
const jwt = require('jsonwebtoken')

const api = supertest(app)

beforeEach(async () => {
    // delete all blogs
    await Blog.deleteMany({})

    // get a valid token for one of your users
    const loginRes = await api.post('/api/login').send({
        username: initialUsers[0].username,
        password: initialUsers[0].password,
    })

    const token = loginRes.body.token

    for (let blog of initialBlogs) {
        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `Bearer ${token}`)
    }
})

test('blog user is populated', async () => {
    const res = await api.get('/api/blogs').expect(200)

    const blogs = res.body
    const firstBlog = blogs[0]
    const blogUser = firstBlog['user']
    assert('username' in blogUser)
})

test('missing token error when creating blog', async () => {
    const newBlog = {
        title: 'My new blog',
        author: 'me',
        url: 'https://fullstackopen.com/',
    }
    await api.post('/api/blogs').send(newBlog).expect(401)
})

test('user identified by the token is the creator of the blog.', async () => {
    // get a valid token for one of your users
    const loginRes = await api.post('/api/login').send({
        username: initialUsers[0].username,
        password: initialUsers[0].password,
    })

    const token = loginRes.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const newBlog = {
        title: 'My new blog',
        author: 'me',
        url: 'https://fullstackopen.com/',
    }
    const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)

    const createdBlog = res.body
    assert.strictEqual(createdBlog.user, decodedToken.id)
})

test('blog can be deleted only by the user who added it.', async () => {
    // get a valid token for one of your users
    const loginRes = await api.post('/api/login').send({
        username: initialUsers[1].username,
        password: initialUsers[1].password,
    })

    const token = loginRes.body.token
    const blogs = await blogsInDb()
    const firstBlog = blogs[0]
    await api
        .delete(`/api/blogs/${firstBlog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
})

after(async () => {
    await mongoose.connection.close()
})
