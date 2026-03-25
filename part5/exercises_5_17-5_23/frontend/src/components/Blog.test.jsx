import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import CreateBlogForm from './CreateBlogForm'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'

test('renders title and author and not url or likes initially', () => {
    const blog = {
        author: 'Ioannis Maragkakis',
        url: 'https://prettier.io/docs/options.html#tabs',
        title: 'about earthquakes',
        user: {
            username: 'ioannis',
        },
    }

    const { container } = render(<Blog blog={blog} />)

    // shown
    const titleElement = screen.getByText(blog.title, { exact: false })
    const authorElement = screen.getByText(blog.author, { exact: false })

    // not shown
    const urlElement = container.getElementsByClassName('url')
    const likesElement = container.getElementsByClassName('likes')

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
    expect(urlElement.length).toBe(0)
    expect(likesElement.length).toBe(0)
})

test('renders url and likes when show blog button clicked', async () => {
    const blog = {
        author: 'Ioannis Maragkakis',
        url: 'https://prettier.io/docs/options.html#tabs',
        title: 'about earthquakes',
        user: {
            username: 'ioannis',
        },
    }
    const user = userEvent.setup()

    const { container } = render(
        <Blog blog={blog} currentUser={{ username: 'ioannis' }} />,
    )

    const showButton = screen.getByText('view')
    await user.click(showButton)

    const likesElement = container.getElementsByClassName('likes')
    expect(likesElement).toHaveLength(1)
})

test('clicking like twice event handler called twice', async () => {
    const blog = {
        author: 'Ioannis Maragkakis',
        url: 'https://prettier.io/docs/options.html#tabs',
        title: 'about earthquakes',
        user: {
            username: 'ioannis',
        },
    }
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    const { container } = render(
        <Blog
            blog={blog}
            currentUser={{ username: 'ioannis' }}
            handleAddLike={mockHandler}
        />,
    )

    const showButton = screen.getByText('view')
    await user.click(showButton)

    const likesElement = container.getElementsByClassName('likes')[0]

    const likesButton = likesElement.querySelector('button')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('test form create a blog with correct details', async () => {
    const user = userEvent.setup()
    const createBlogHandler = vi.fn()

    render(<CreateBlogForm handleCreateNewBlog={createBlogHandler} />)
    screen.debug()
    const titleInput = screen.getByLabelText('title', { exact: false })
    const authorInput = screen.getByLabelText('author', { exact: false })
    const urlInput = screen.getByLabelText('url', { exact: false })

    await user.type(titleInput, 'testing title...')
    await user.type(authorInput, 'testing author...')
    await user.type(urlInput, 'https://fullstackopen.com/testingurl')

    const createButton = screen.getByRole('button')
    await user.click(createButton)

    expect(createBlogHandler.mock.calls).toHaveLength(1)
    expect(createBlogHandler.mock.calls[0][0]).toEqual({
        title: 'testing title...',
        author: 'testing author...',
        url: 'https://fullstackopen.com/testingurl',
    })
})
