import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      return state.concat(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    sortBlogs(state, action) {
      const mode = action.payload
      const sortedBlogs = [...state]
      return sortedBlogs.sort((a, b) =>
        mode === 'asc' ? a.likes - b.likes : b.likes - a.likes
      )
    },
    updateBlog(state, action) {
      const id = action.payload.id
      const newBLog = action.payload.blog
      return state.map((blog) => (blog.id === id ? newBLog : blog))
    },
  },
})

const { setBlogs, addBlog, removeBlog, sortBlogs, updateBlog } =
  blogsSlice.actions

export const addNewBlog = (newBlog) => {
  return async (dispatch) => {
    const createdBlog = await blogService.createBlog(newBlog)
    dispatch(addBlog(createdBlog))
  }
}

export const setInitialBlogs = () => {
  return async (dispatch) => {
    const initialBlogs = await blogService.getAllBlogs()
    dispatch(setBlogs(initialBlogs))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addComment = ({ id, comment }) => {
  return async (dispatch) => {
    const blog = await blogService.commentOne(id, comment)
    dispatch(updateBlog({ id, blog }))
  }
}

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const user = state.user
    const blogs = state.blogs
    const blogToUpdate = blogs.find((blog) => blog.id === id)
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }
    blogService.setToken(user.token)
    const blog = await blogService.updateBlog(id, updatedBlog)
    dispatch(updateBlog({ id, blog }))
  }
}
export { setBlogs, sortBlogs }
export default blogsSlice.reducer
