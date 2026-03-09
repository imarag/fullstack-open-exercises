const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const testBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
    },
]

const listWithOneBlog = [testBlogs[0]]

test('dummy returns one', () => {
    const result = listHelper.dummy(testBlogs)
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
        const result = listHelper.totalLikes(testBlogs)

        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('returns the blog with the most likes', () => {
        const result = listHelper.favoriteBlog(testBlogs)

        assert.deepStrictEqual(result, testBlogs[2])
    })

    test('when list has only one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)

        assert.deepStrictEqual(result, testBlogs[0])
    })
})

describe('most blogs', () => {
    test('returns the author with the most blogs', () => {
        const result = listHelper.mostBlogs(testBlogs)
        assert.deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3,
        })
    })

    test('when list has only one blog, returns that author blogs', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: testBlogs[0].author,
            blogs: 1,
        })
    })
})

describe('most likes', () => {
    test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(testBlogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17,
        })
    })

    test('when list has only one blog, returns that author likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: testBlogs[0].author,
            likes: testBlogs[0].likes,
        })
    })
})
