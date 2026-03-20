import { useState } from 'react'

export default function Blog({
    blog,
    handleAddLike,
    handleRemoveBlog,
    currentUser,
}) {
    const [showContent, setShowContent] = useState(false)
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
    console.log(blog.user.username, currentUser.username)
    return (
        <div style={blogStyle}>
            {blog.title}{' '}
            <button onClick={() => setShowContent((prev) => !prev)}>
                {showContent ? 'hide' : 'view'}
            </button>
            {showContent && (
                <div>
                    <p>{blog.url}</p>
                    <p>
                        likes {blog.likes}{' '}
                        <button onClick={handleAddLike}>like</button>
                    </p>
                    <p>{blog.author}</p>
                    {blog.user.username === currentUser.username && (
                        <p>
                            <button onClick={handleDeleteBlog}>remove</button>
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
