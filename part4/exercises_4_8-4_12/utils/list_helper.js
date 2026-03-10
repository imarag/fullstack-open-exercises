var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + (blog?.likes ? blog.likes : 0)
    }, 0)
}

const favoriteBlog = (blogs) => {
    const blogsList = blogs || []

    const maxLikeValue = blogsList.reduce((maxValue, blog) => {
        if (blog.likes > maxValue) {
            maxValue = blog.likes
        }
        return maxValue
    }, 0)

    return blogsList.find((blog) => blog.likes === maxLikeValue)
}

const mostBlogs = (blogs) => {
    const blogsList = blogs || []
    return _.chain(blogsList)
        .groupBy('author')
        .map((arr, name) => ({ author: name, blogs: arr.length }))
        .maxBy('blogs')
        .value()
}

const mostLikes = (blogs) => {
    const blogsList = blogs || []
    return _.chain(blogsList)
        .groupBy('author')
        .map((arr, name) => ({ author: name, likes: _.sumBy(arr, 'likes') }))
        .maxBy('likes')
        .value()
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
