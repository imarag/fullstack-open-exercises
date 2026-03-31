import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'

const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange,
    }
}

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    const getAll = useCallback(async () => {
        const res = await axios.get(baseUrl)
        return res.data
    }, [baseUrl])

    const create = useCallback(
        async (resource) => {
            const res = await axios.post(baseUrl, resource)
            setResources((prev) => prev.concat(res.data))
            return res.data
        },
        [baseUrl],
    )

    const update = useCallback(
        async (id, resource) => {
            const res = await axios.put(`${baseUrl}/${id}`, resource)
            setResources((prev) =>
                prev.map((r) => (r.id === id ? res.data : r)),
            )
            return res.data
        },
        [baseUrl],
    )

    const service = useMemo(() => {
        return { create, getAll, update }
    }, [create, getAll, update])

    useEffect(() => {
        async function fetchResources() {
            try {
                const resourceData = await service.getAll()
                setResources(resourceData)
            } catch (err) {
                console.error(err.message)
                setResources([])
            }
        }

        fetchResources()
    }, [baseUrl, service])

    return [resources, service]
}

const App = () => {
    const content = useField('text')
    const name = useField('text')
    const number = useField('text')

    const [notes, noteService] = useResource('http://localhost:3005/notes')
    const [persons, personService] = useResource(
        'http://localhost:3005/persons',
    )

    const handleNoteSubmit = (event) => {
        event.preventDefault()
        noteService.create({ content: content.value })
    }

    const handlePersonSubmit = (event) => {
        event.preventDefault()
        personService.create({ name: name.value, number: number.value })
    }

    return (
        <div>
            <h2>notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input {...content} />
                <button>create</button>
            </form>
            {notes.map((n) => (
                <p key={n.id}>{n.content}</p>
            ))}

            <h2>persons</h2>
            <form onSubmit={handlePersonSubmit}>
                name <input {...name} /> <br />
                number <input {...number} />
                <button>create</button>
            </form>
            {persons.map((n) => (
                <p key={n.id}>
                    {n.name} {n.number}
                </p>
            ))}
        </div>
    )
}

export default App
