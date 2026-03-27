import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const anecdoteQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  const voteUnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = (anecdote) => {
    voteUnecdoteMutation.mutate({
      id: anecdote.id,
      updatedAnecdote: { ...anecdote, votes: anecdote.votes + 1 },
    })
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: `anecdote '${anecdote.content}' voted.`,
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  if (anecdoteQuery.isPending) {
    return <div>loading data...</div>
  }

  if (anecdoteQuery.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdoteQuery.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
