import { useState } from "react";

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function App() {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const anecdotesInitialVotes = anecdotes.map((el) => 0);
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotesInitialVotes);

  function handleNextAnecdote() {
    let randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  }

  function handleVote(selectedIndex) {
    setVotes([
      ...votes.slice(0, selectedIndex),
      votes[selectedIndex] + 1,
      ...votes.slice(selectedIndex + 1),
    ]);
  }

  const maxVote = Math.max(...votes);
  const maxVoteAnecdoteIndex = votes.findIndex((el) => el === maxVote);

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text={"next anecdote"} onClick={handleNextAnecdote} />
      <Button text={"vote"} onClick={() => handleVote(selected)} />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxVoteAnecdoteIndex]}</p>
    </div>
  );
}

export default App;
