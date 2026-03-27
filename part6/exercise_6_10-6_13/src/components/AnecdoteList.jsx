import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import {
    setNotification,
    clearNotification,
} from '../reducers/notificationReducer'

function Anecdote({ anecdote }) {
    const dispatch = useDispatch()

    const vote = (id) => {
        dispatch(voteAnecdote(id))
        dispatch(setNotification('You have voted an anecdote.'))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
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
