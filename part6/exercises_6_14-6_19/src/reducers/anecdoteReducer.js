import { createSlice } from '@reduxjs/toolkit'
import { getAll, createNew, updateOne } from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        createAnecdote(state, action) {
            const newAnecdote = action.payload
            return [...state, newAnecdote].sort((a, b) => b.votes - a.votes)
        },
        voteAnecdote(state, action) {
            const updatedAnecdote = action.payload
            const id = updatedAnecdote.id
            return state
                .map((an) => (an.id === id ? updatedAnecdote : an))
                .sort((a, b) => b.votes - a.votes)
        },
        setAnecdotes(state, action) {
            return action.payload
        },
    },
})

const { setAnecdotes, createAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const anecdotes = await getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const addNewAnecdote = (content) => {
    return async (dispatch) => {
        const newAnecdote = await createNew(content)
        dispatch(createAnecdote(newAnecdote))
    }
}

export const likeAnecdote = (id, updatedItem) => {
    return async (dispatch) => {
        const anecdote = await updateOne(id, updatedItem)
        dispatch(voteAnecdote(anecdote))
    }
}

export const { voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
