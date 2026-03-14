const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    res.status(200).json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blogId = req.params.id
    const blog = await Blog.findById(blogId)

    if (!blog) {
        return res
            .status(404)
            .json({ error: `Blog with id  ${blogId} does not exist.` })
    }

    const returnBlog = await blog.populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    res.status(200).json(returnBlog)
})

blogsRouter.post('/', async (req, res, next) => {
    try {
        // get the user doing this request
        const userId = req.user
        const { title, author, url, likes } = req.body

        const blog = new Blog({ title, author, url, likes, user: userId })
        // assign the user id into the user field on the blog
        blog.user = userId
        const savedBlog = await blog.save()

        const userInDB = await User.findById(userId)
        userInDB.blogs = userInDB.blogs.concat(blog._id)
        await userInDB.save()

        res.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (req, res) => {
    const blogId = req.params.id
    const blog = await Blog.findById(blogId)

    if (!blog) {
        return res
            .status(404)
            .json({ error: `Blog with id ${blogId} is not found.` })
    }

    // check if the user initiated the request is the same as the blog user
    if (blog.user.toString() !== req.user.toString()) {
        return res.status(403).json({ error: 'Not permitted' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const blogId = req.params.id

    const existingBlog = await Blog.findById(blogId)

    if (!existingBlog) {
        return res
            .status(404)
            .json({ error: `Blog with id ${blogId} does not exist.` })
    }

    // Update only the fields that are provided
    if (body.title) existingBlog.title = body.title
    if (body.author) existingBlog.author = body.author
    if (body.url) existingBlog.url = body.url
    if (body.likes) existingBlog.likes = body.likes

    const updatedBlog = await existingBlog.save()
    res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
