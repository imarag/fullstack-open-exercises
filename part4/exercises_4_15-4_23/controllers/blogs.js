const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
    const blogId = req.params.id
    const blog = await Blog.findById(blogId)

    if (!blog) {
        return res.status(404).json({ error: 'Blog does not exist.' })
    }

    const returnBlog = await blog.populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    res.status(200).json(returnBlog)
})

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)

    // added token validation in middleware

    const blogId = blog._id

    const userId = req.user
    const user = await User.findById(userId)
    user.blogs = user.blogs.concat(blogId)

    await user.save()
    blog.user = userId
    const result = await blog.save()
    res.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== req.user.toString()) {
        return res.status(403).json({ error: 'Not permitted' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const blogUpdates = req.body
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(404).end()
    }

    // Update only the fields that are provided
    if (blogUpdates.title !== undefined) blog.title = blogUpdates.title
    if (blogUpdates.author !== undefined) blog.author = blogUpdates.author
    if (blogUpdates.url !== undefined) blog.url = blogUpdates.url
    if (blogUpdates.likes !== undefined) blog.likes = blogUpdates.likes

    const updatedBlog = await blog.save()
    res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
