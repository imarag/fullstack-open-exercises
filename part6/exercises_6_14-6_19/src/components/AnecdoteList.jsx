import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote } from '../reducers/anecdoteReducer'
import { updateNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'
import { initializeAnecdotes } from '../reducers/anecdoteReducer'

function Anecdote({ anecdote }) {
    const dispatch = useDispatch()

    const vote = (id) => {
        dispatch(likeAnecdote(id, { ...anecdote, votes: anecdote.votes + 1 }))
        dispatch(updateNotification('You have voted an anecdote.', 5))
    }
    return (
        <div>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
    )
}

export default function AnecdoteList() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch])

    const anecdotes = useSelector((state) => {
        return state.filter
            ? state.anecdotes.filter((an) => an.content.includes(state.filter))
            : state.anecdotes
    })

    return (
        <div>
            {anecdotes.map((an) => (
                <Anecdote key={an.id} anecdote={an} />
            ))}
        </div>
    )
}
