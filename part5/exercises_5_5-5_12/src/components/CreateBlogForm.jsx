import { useState } from 'react'

export default function CreateBlogForm({ handleCreateNewBlog }) {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
    })

    function handleAddNewBlog(e) {
        e.preventDefault()

        handleCreateNewBlog(newBlog)
        setNewBlog({
            title: '',
            author: '',
            url: '',
        })
    }

    return (
        <form onSubmit={handleAddNewBlog}>
            <div>
                <label>
                    title:{' '}
                    <input
                        type='text'
                        value={newBlog.title}
                        onChange={(e) =>
                            setNewBlog((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    author:{' '}
                    <input
                        type='text'
                        value={newBlog.author}
                        onChange={(e) =>
                            setNewBlog((prev) => ({
                                ...prev,
                                author: e.target.value,
                            }))
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    url:{' '}
                    <input
                        type='url'
                        value={newBlog.url}
                        onChange={(e) =>
                            setNewBlog((prev) => ({
                                ...prev,
                                url: e.target.value,
                            }))
                        }
                    />
                </label>
            </div>
            <div>
                <button type='submit'>create</button>
            </div>
        </form>
    )
}
