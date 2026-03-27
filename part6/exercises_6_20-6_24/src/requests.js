const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('Cannot get the data')
  }

  return await res.json()
}

const createAnecdote = async (newAnecdote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote),
  }
  const res = await fetch(baseUrl, options)

  if (!res.ok) {
    throw new Error('Cannot add anecdote')
  }

  return await res.json()
}

const updateAnecdote = async ({ id, updatedAnecdote }) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote),
  }
  const res = await fetch(`${baseUrl}/${id}`, options)

  if (!res.ok) {
    throw new Error('Cannot update anecdote')
  }

  return await res.json()
}

export { getAnecdotes, createAnecdote, updateAnecdote }
