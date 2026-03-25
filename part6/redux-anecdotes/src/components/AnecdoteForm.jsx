import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

export default function AnecdoteForm() {
    const dispatch = useDispatch()

    function handleSubmitAnecdote(e) {
        e.preventDefault()
        const value = e.target.anecdote.value
        e.target.anecdote.value = ''
        dispatch(createAnecdote(value))
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleSubmitAnecdote}>
                <div>
                    <input type='text' name='anecdote' />
                </div>
                <button>create</button>
            </form>
        </div>
    )
}
