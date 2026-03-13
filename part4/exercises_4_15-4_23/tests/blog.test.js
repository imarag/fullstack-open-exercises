const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const { blogsInDb, initialBlogs } = require('../tests/test_helper')

const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

const listWithOneBlog = [initialBlogs[0]]

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of initialBlogs) {
        let blogObj = new Blog(blog)
        await blogObj.save()
    }
})

test('dummy returns one', () => {
    const result = listHelper.dummy(initialBlogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])

        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)

        assert.strictEqual(result, 7)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(initialBlogs)

        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('returns the blog with the most likes', () => {
        const result = listHelper.favoriteBlog(initialBlogs)

        assert.deepStrictEqual(result, initialBlogs[2])
    })

    test('when list has only one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)

        assert.deepStrictEqual(result, initialBlogs[0])
    })
})

describe('most blogs', () => {
    test('returns the author with the most blogs', () => {
        const result = listHelper.mostBlogs(initialBlogs)
        assert.deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3,
        })
    })

    test('when list has only one blog, returns that author blogs', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: initialBlogs[0].author,
            blogs: 1,
        })
    })
})

describe('most likes', () => {
    test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(initialBlogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        })
    })

    test('when list has only one blog, returns that author likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: initialBlogs[0].author,
            likes: initialBlogs[0].likes,
        })
    })
})

describe('test that', () => {
    test('GET /api/blogs returns correct number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(Array.isArray(response.body), true)
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('blog has an identifier of name "id"', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        const containAllIdName = blogs.every((blog) => 'id' in blog)

        assert.strictEqual(containAllIdName, true)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Prog Language',
            author: 'Ioannis Maragkakis',
            likes: 2,
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        assert.strictEqual(blogsAfter.length, initialBlogs.length + 1)

        const titles = blogsAfter.map((b) => b.title)

        assert.ok(titles.includes('Prog Language'))
    })

    test('empty likes default to zero', async () => {
        const newBlog = {
            title: 'About earthquakes',
            author: 'Ioannis Maragkakis',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await blogsInDb()
        const addedPost = blogs.find(
            (blog) => blog.title === 'About earthquakes',
        )

        assert.strictEqual(addedPost.likes, 0)
    })
})

describe('blog missing key', () => {
    test('title returns 400', async () => {
        const newBlog = {
            author: 'Ioannis Maragkakis',
            url: 'https://example.com',
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('url returns 400', async () => {
        const newBlog = {
            title: 'About data processing',
            author: 'Ioannis Maragkakis',
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
    })
})

test('test delete method on single post', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((b) => b.title)

    assert.ok(!titles.includes(blogToDelete.title))
})

test.only('test update method likes of a blog can be updated', async () => {
    const blogsAtStart = await blogsInDb()
    const blogBefore = blogsAtStart[0]

    const updatedBlog = {
        likes: 20,
    }

    await api.put(`/api/blogs/${blogBefore.id}`).send(updatedBlog).expect(200)

    const blogsAtEnd = await blogsInDb()

    const blogAfter = blogsAtEnd.find((blog) => blog.id === blogBefore.id)

    assert.strictEqual(blogAfter.likes, 20)
})
after(async () => {
    await mongoose.connection.close()
})
