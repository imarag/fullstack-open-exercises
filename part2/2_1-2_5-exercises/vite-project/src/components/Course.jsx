function Header({ text }) {
  return <h1>{text}</h1>;
}

function Part({ name, exercises }) {
  return (
    <p>
      {name} {exercises}
    </p>
  );
}

function Content({ parts }) {
  const totalExercises = parts
    .map((el) => el.exercises)
    .reduce((acc, num) => acc + num, 0);
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p>
        <strong>total of {totalExercises} exercises</strong>
      </p>
    </>
  );
}

export default function Course({ course }) {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
    </div>
  );
}
