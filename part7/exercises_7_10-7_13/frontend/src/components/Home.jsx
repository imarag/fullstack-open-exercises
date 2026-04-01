import CreateBlogForm from './CreateBlogForm'
import { useDispatch } from 'react-redux'
import { updateNotification } from '../reducers/notificationReducer'
import { useSelector } from 'react-redux'
import Toggable from './Toggable'
import { addNewBlog } from '../reducers/blogsReducer'

import { Link } from 'react-router-dom'

export default function Home() {
  const blogs = useSelector((state) => state.blogs)
  const currentUser = useSelector((state) => state.currentUser)

  const dispatch = useDispatch()

  async function handleAddNewBlog(e) {
    e.preventDefault()

    try {
      dispatch(
        addNewBlog({
          title: e.target.title.value,
          author: e.target.author.value,
          url: e.target.url.value,
        })
      )
      dispatch(
        updateNotification(
          `A new blog added '${e.target.title.value}'`,
          'success'
        )
      )
    } catch (err) {
      dispatch(updateNotification(err.message, 'error'))
    }
  }

  return (
    <div>
      {currentUser && (
        <div className="space-y-4">
          <Toggable buttonLabel="create new blog">
            <div>
              <h2 className="text-2xl font-semibold mb-4">create new</h2>
              <CreateBlogForm handleAddNewBlog={handleAddNewBlog} />
            </div>
          </Toggable>
          <div className="flex flex-col items-stretch gap-4">
            {blogs.map((item) => (
              <Link className="block" to={`/blogs/${item.id}`}>
                <p className="bg-gray-200 p-3 rounded-md hover:bg-gray-300">
                  {item.title} {item.author}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
