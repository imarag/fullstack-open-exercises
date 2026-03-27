import { useDispatch } from 'react-redux'
import { addNewAnecdote } from '../reducers/anecdoteReducer'
import { updateNotification } from '../reducers/notificationReducer'

export default function AnecdoteForm() {
    const dispatch = useDispatch()

    async function handleSubmitAnecdote(e) {
        e.preventDefault()
        const content = e.target.anecdote.value
        e.target.anecdote.value = ''
        dispatch(addNewAnecdote(content))
        dispatch(updateNotification('Anecdote created succesfully.', 3))
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
