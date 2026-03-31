import { useState } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Footer from './components/Footer'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import Anecdote from './components/Anecdote'
import About from './components/About'
import Notification from './components/Notification'

const App = () => {
    const [anecdotes, setAnecdotes] = useState([
        {
            content: 'If it hurts, do it more often',
            author: 'Jez Humble',
            info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
            votes: 0,
            id: 1,
        },
        {
            content: 'Premature optimization is the root of all evil',
            author: 'Donald Knuth',
            info: 'http://wiki.c2.com/?PrematureOptimization',
            votes: 0,
            id: 2,
        },
    ])

    const [notification, setNotification] = useState('')

    const anecdoteById = (id) => anecdotes.find((a) => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1,
        }

        setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
    }

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
    }

    const match = useMatch('/anecdotes/:id')
    const anecdote = match
        ? anecdotes.find((an) => an.id === Number(match.params.id))
        : null

    return (
        <div>
            <h1>Software anecdotes</h1>
            <Menu />
            <Notification message={notification} />
            <Routes>
                <Route
                    path='/create'
                    element={
                        <CreateNew
                            setNotification={setNotification}
                            addNew={addNew}
                        />
                    }
                />
                <Route
                    path='/anecdotes/:id'
                    element={<Anecdote anecdote={anecdote} />}
                />
                <Route path='/about' element={<About />} />
                <Route
                    path='/'
                    element={<AnecdoteList anecdotes={anecdotes} />}
                />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
