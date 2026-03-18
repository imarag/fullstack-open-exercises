import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import './index.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })


  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Found user!', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAllBlogs().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setSuccessMessage(`Welcome home ${username}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  function handleUserLogout() {
    localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  async function handleAddNewBlog(e) {
    e.preventDefault()
    try {
      const createdBlog = await blogService.createBlog(newBlog)
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      setBlogs([...blogs, createdBlog])
      setSuccessMessage(`A new blog added '${createdBlog.title}'`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch (err) {
      setErrorMessage(err.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  return (
    <div>
      {successMessage && (
        <Notification message={successMessage} type="success" />
      )}
      {errorMessage && (
        <Notification message={errorMessage} type="error" />
      )}
      {
        !user && (
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        )
      }
      {
        user && (
          <div>
            <div>
              <h2>blogs</h2>
              <p>{user.name} logged in <button onClick={handleUserLogout}>logout</button></p>
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
            <CreateBlogForm newBlog={newBlog} setNewBlog={setNewBlog} handleAddNewBlog={handleAddNewBlog} />
          </div>
        )
      }
    </div>
  )
}

export default App