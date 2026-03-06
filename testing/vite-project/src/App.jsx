import axios from 'axios'
const baseUrl = "http://localhost:3001/"

import { useState, useEffect } from 'react'

function Title({ children }) {
  return (
    <h3 className="text-3xl font-semibold">{children}</h3>
  )
}

function Button({ text, onClick }) {
  return (
    <button className="btn btn-sm" type="button" onClick={(e) => {
      e.preventDefault(); // prevent accidental form submission
      onClick?.();
    }}>{text}</button>
  )
}

function NotesList({ notes, handleDeleteNote }) {
  return (
    <div>
      <Title>
        All Notes{" "}{notes.length}
      </Title>
      <div className="h-96 overflow-y-scroll space-y-4">
        {
          notes.map(note => (
            <div key={note.id} className="bg-gray-400 space-y-2 p-4">
              <h2 className="font-semibold">{note.name}</h2>
              <p className="text-black/60">{note.content}</p>
              <p className="text-sm">{note.important}</p>
              <div className="flex items-center gap-2">
                <Button text="update" />
                <Button text="delete" onClick={() => handleDeleteNote(note.id)} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function NewNote({ setNotes }) {
  const [newNote, setNewNote] = useState({ name: "", content: "", important: false })

  async function handleAddNewNote(e) {
    e.preventDefault();
    axios.post(`${baseUrl}notes`, newNote)
      .then(res => {
        setNotes(prev => [...prev, res.data])
      })
  }

  return (
    <div>
      <Title>
        Add new note
      </Title>
      <form onSubmit={handleAddNewNote} className="flex flex-col gap-4">
        <input className="input" type="text" value={newNote.name} onChange={(e) => setNewNote(prev => ({ ...prev, name: e.target.value }))} />
        <input className="input" type="text" value={newNote.content} onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))} />
        <div>
          <button className="btn btn-primary btn-sm" type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get(`${baseUrl}notes`)
      .then(res => {
        setNotes(res.data)
      })
  }, [])

  async function handleDeleteNote(noteId) {
    axios.delete(`${baseUrl}notes/${noteId}`)
      .then(res => {
        console.log(res.data)
        setNotes(prev => prev.filter(note => note.id !== noteId))
      })
  }

  return (
    <div className="space-y-4">
      <NotesList notes={notes} handleDeleteNote={handleDeleteNote} />
      <NewNote setNotes={setNotes} />
    </div>
  )
}

export default App
