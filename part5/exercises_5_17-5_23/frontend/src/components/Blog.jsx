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

    return (
        <div style={blogStyle} className='blog'>
            <p>{blog.title}</p> <p>{blog.author}</p>
            <button onClick={() => setShowContent((prev) => !prev)}>
                {showContent ? 'hide' : 'view'}
            </button>
            {showContent && (
                <div>
                    <p className='url'>{blog.url}</p>
                    <p className='likes'>
                        likes <span className='likes-value'>{blog.likes}</span>{' '}
                        <button onClick={handleAddLike}>like</button>
                    </p>
                    {currentUser.username}{' '}
                    {blog?.user?.username === currentUser?.username && (
                        <p>
                            <button onClick={handleDeleteBlog}>remove</button>
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
