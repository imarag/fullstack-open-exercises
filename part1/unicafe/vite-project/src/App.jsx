import { useState } from "react";

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

function StatisticLine({ text, value }) {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {text === "positive" && "%"}
      </td>
    </tr>
  );
}

function Statistics({ good, bad, neutral }) {
  const totalClicks = good + bad + neutral;
  const avgClicks = (good * 1 + neutral * 0 + bad * -1) / totalClicks;
  const positiveClicks = 100 * (good / totalClicks);
  return (
    <>
      {totalClicks === 0 ? (
        <p>No feedback given</p>
      ) : (
        <>
          <table>
            <tbody>
              <StatisticLine text={"good"} value={good} />
              <StatisticLine text={"neutral"} value={neutral} />
              <StatisticLine text={"bad"} value={bad} />
              <StatisticLine text={"all"} value={totalClicks} />
              <StatisticLine text={"average"} value={avgClicks} />
              <StatisticLine text={"positive"} value={positiveClicks} />
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <h1>statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  );
};

export default App;
