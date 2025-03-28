function Header({ course }) {
  return <h1>{course}</h1>;
}

function Part({ part, exercise }) {
  console.log(part, exercise);
  return (
    <p>
      {part} {exercise}
    </p>
  );
}

function Content({ parts }) {
  return (
    <>
      {parts.map((el) => (
        <Part part={el.name} exercise={el.exercises} />
      ))}
    </>
  );
}

function Total({ parts }) {
  let totalExercises = 0;
  parts.forEach((el) => {
    totalExercises += el.exercises;
  });
  return <p>Number of exercises {totalExercises}</p>;
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
