import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import './index.css'
import { setInitialUsers } from './reducers/usersReducer'
import { setInitialBlogs } from './reducers/blogsReducer'
import { updateNotification } from './reducers/notificationReducer'
import { useSelector } from 'react-redux'
import { setCurrentUser } from './reducers/currentUserReducer'
import UsersList from './components/UsersList'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NavBar from './components/NavBar'
import { useMatch } from 'react-router-dom'
import User from './components/User'
import Home from './components/Home'
import { useDispatch } from 'react-redux'
import './index.css'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users)
  const notification = useSelector((state) => state.notification)
  const currentUser = useSelector((state) => state.currentUser)

  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const dispatch = useDispatch()
  const userMatch = useMatch('/users/:id')
  const user = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null
  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()

    try {
      const user = await loginService.login(credentials)
      dispatch(setCurrentUser(user))
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(
        updateNotification(`Welcome home ${credentials.username}`, 'success')
      )
      navigate('/')
    } catch {
      dispatch(updateNotification('Wrong username or password', 'error'))
    }
  }

  useEffect(() => {
    dispatch(setInitialBlogs())
    dispatch(setInitialUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Found user!', user)
      dispatch(setCurrentUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  return (
    <div className="mx-12 my-4">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {!currentUser && (
        <LoginForm
          handleLogin={handleLogin}
          credentials={credentials}
          setCredentials={setCredentials}
        />
      )}
      {currentUser && (
        <>
          <NavBar />
          <h1 className="text-3xl font-semibold mb-10">Blog App</h1>
        </>
      )}

      <Routes>
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<User user={user} />} />
        <Route
          path="/blogs/:id"
          element={<Blog currentUser={currentUser} blog={blog} />}
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
