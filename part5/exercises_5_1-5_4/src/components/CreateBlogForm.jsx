import { useState } from 'react'

export default function CreateBlogForm({ newBlog, setNewBlog, handleAddNewBlog }) {
  return (
    <form onSubmit={handleAddNewBlog}>
      <div>
        title:{' '}
        <input
          type="text"
          value={newBlog.title}
          onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div>
        author:{' '}
        <input
          type="text"
          value={newBlog.author}
          onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
        />
      </div>
      <div>
        url:{' '}
        <input
          type="url"
          value={newBlog.url}
          onChange={(e) => setNewBlog(prev => ({ ...prev, url: e.target.value }))}
        />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}