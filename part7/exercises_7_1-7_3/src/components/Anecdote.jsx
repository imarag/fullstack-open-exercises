export default function Anecdote({ anecdote }) {
    return (
        <li style={{ fontSize: '20px' }} key={anecdote.id}>
            <p>
                <strong>
                    {anecdote.content} by {anecdote.author}
                </strong>
            </p>
            <p>has {anecdote.votes} votes</p>
            <p>
                for more info see <a href={anecdote.info}>{anecdote.info}</a>
            </p>
        </li>
    )
}
