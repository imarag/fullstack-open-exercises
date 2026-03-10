const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const postId = request.params.id

    await Blog.findByIdAndDelete(postId)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blogUpdates = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    // Update only the fields that are provided
    if (blogUpdates.title !== undefined) blog.title = blogUpdates.title
    if (blogUpdates.author !== undefined) blog.author = blogUpdates.author
    if (blogUpdates.url !== undefined) blog.url = blogUpdates.url
    if (blogUpdates.likes !== undefined) blog.likes = blogUpdates.likes

    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
