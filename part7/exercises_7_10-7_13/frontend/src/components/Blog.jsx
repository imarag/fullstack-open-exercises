import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBlog, likeBlog } from '../reducers/blogsReducer'
import { updateNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { addComment } from '../reducers/blogsReducer'

export default function Blog({ blog, currentUser }) {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  function handleDeleteBlog() {
    const ok = confirm(`Delete "${blog.title}"?`)
    if (!ok) return
    handleRemoveBlog()
  }

  if (!blog) {
    return null
  }

  async function handleAddLike(blogId) {
    try {
      blogService.setToken(currentUser.token)
      dispatch(likeBlog(blogId))
    } catch (err) {
      dispatch(updateNotification(err.message, 'error'))
    }
  }

  async function handleRemoveBlog(blogId) {
    try {
      dispatch(deleteBlog(blogId))
    } catch (err) {
      dispatch(updateNotification(err.message, 'error'))
    }
  }

  async function handleCommentBlog(e) {
    e.preventDefault()
    dispatch(addComment({ id: blog.id, comment }))
  }

  return (
    <div style={blogStyle}>
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url} target="_blank">
          {blog.url}
        </a>
      </p>
      <p className="likes">
        {blog.likes} likes <button onClick={handleAddLike}>like</button>
      </p>
      <p>added by {blog.author}</p>
      {blog.user.username === currentUser.username && (
        <p>
          <button onClick={handleDeleteBlog}>remove</button>
        </p>
      )}
      <div>
        <form onSubmit={handleCommentBlog}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <p>
            <button type="submit">comment</button>
          </p>
        </form>
      </div>
      <div>
        <h2>Comments</h2>
        {blog?.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        ) : (
          <p>no comments to display</p>
        )}
      </div>
    </div>
  )
}
