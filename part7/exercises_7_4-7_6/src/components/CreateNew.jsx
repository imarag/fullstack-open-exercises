import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

export default function CreateNew({ addNew, setNotification }) {
    const { reset: contentReset, ...content } = useField('text')
    const { reset: authorReset, ...author } = useField('text')
    const { reset: infoReset, ...info } = useField('text')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0,
        })
        navigate('/')
        setNotification(`a new anecdote ${content.value} created!`)
        setTimeout(() => {
            setNotification('')
        }, 5000)
    }

    const handleClearFields = () => {
        contentReset()
        authorReset()
        infoReset()
    }

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input name='content' {...content} />
                </div>
                <div>
                    author
                    <input name='author' {...author} />
                </div>
                <div>
                    url for more info
                    <input name='info' {...info} />
                </div>
                <button>create</button>
                <button type='button' onClick={handleClearFields}>
                    reset
                </button>
            </form>
        </div>
    )
}
