import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAllBlogs = async () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const createBlog = async (newBlog) => {
    const config = {
        headers: { Authorization: token },
    }
    const request = axios.post(baseUrl, newBlog, config)
    return request.then((response) => response.data)
}

const updateBlog = async (blogId, newBlog) => {
    const request = axios.put(`${baseUrl}/${blogId}`, newBlog)
    return request.then((response) => response.data)
}

const deleteBlog = async (blogId) => {
    const request = axios.delete(`${baseUrl}/${blogId}`)
    return request.then((response) => response.data)
}

export default {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    setToken,
}
