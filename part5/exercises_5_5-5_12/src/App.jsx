import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import './index.css'
import Toggable from './components/Toggable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

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
        blogService.getAllBlogs().then((blogs) => setBlogs(blogs))
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
        } catch {
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

    async function handleCreateNewBlog(newBlog) {
        try {
            const createdBlog = await blogService.createBlog(newBlog)
            setBlogs([...blogs, createdBlog])
            setSuccessMessage(`A new blog added '${createdBlog.title}'`)
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
        } catch (err) {
            setErrorMessage(err.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    async function handleAddLike(blogId) {
        try {
            const blogToUpdate = blogs.find((blog) => blog.id === blogId)
            blogToUpdate.likes += 1
            const updatedBlog = await blogService.updateBlog(
                blogId,
                blogToUpdate,
            )
            setBlogs(
                blogs.map((blog) => (blog.id === blogId ? updatedBlog : blog)),
            )
        } catch (err) {
            setErrorMessage(err.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    function handleSortBlogs(mode) {
        const sortedBlogs = [...blogs]
        sortedBlogs.sort((a, b) =>
            mode === 'asc' ? a.likes - b.likes : b.likes - a.likes,
        )
        setBlogs(sortedBlogs)
    }

    async function handleRemoveBlog(blogId) {
        try {
            await blogService.deleteBlog(blogId)
            setBlogs(blogs.filter((blog) => blog.id !== blogId))
        } catch (err) {
            setErrorMessage(err.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <div>
            {successMessage && (
                <Notification message={successMessage} type='success' />
            )}
            {errorMessage && (
                <Notification message={errorMessage} type='error' />
            )}
            {!user && (
                <LoginForm
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                />
            )}
            {user && (
                <div>
                    <div>
                        <h2>blogs</h2>
                        <p>
                            {user.name} logged in{' '}
                            <button onClick={handleUserLogout}>logout</button>
                        </p>
                        <button onClick={() => handleSortBlogs('asc')}>
                            sort by likes ascending
                        </button>
                        <button onClick={() => handleSortBlogs('desc')}>
                            sort by likes descending
                        </button>
                        {blogs.map((blog) => (
                            <Blog
                                key={blog.id}
                                currentUser={user}
                                blog={blog}
                                handleAddLike={() => handleAddLike(blog.id)}
                                handleRemoveBlog={() =>
                                    handleRemoveBlog(blog.id)
                                }
                            />
                        ))}
                    </div>
                    <Toggable buttonLabel='create new blog'>
                        <div>
                            <h2>create new</h2>
                            <CreateBlogForm
                                handleCreateNewBlog={handleCreateNewBlog}
                            />
                        </div>
                    </Toggable>
                </div>
            )}
        </div>
    )
}

export default App
