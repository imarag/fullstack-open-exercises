const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const res = await fetch(baseUrl)

    if (!res.ok) {
        throw new Error('Cannot fetch anecdotes.')
    }

    return res.json()
}

const createNew = async (content) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 }),
    }
    const res = await fetch(baseUrl, options)

    if (!res.ok) {
        throw new Error('Cannot create anecdote.')
    }

    return await res.json()
}

const updateOne = async (id, updatedItem) => {
    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedItem, id }),
    }
    const res = await fetch(`${baseUrl}/${id}`, options)

    if (!res.ok) {
        throw new Error('Cannot update anecdote.')
    }

    return await res.json()
}

export { getAll, createNew, updateOne }
