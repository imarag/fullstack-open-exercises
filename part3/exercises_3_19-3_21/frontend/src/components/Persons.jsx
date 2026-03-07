function PersonDetail({ name, number }) {
  return (
    <>
      <span>{name}</span>
      <span> </span>
      <span>{number}</span>
    </>
  );
}

export default function Persons({ personsList, handleDeletePerson }) {
  return (
    <>
      {personsList.length !== 0 ? (
        personsList.map((el) => (
          <p key={el.id}>
            <PersonDetail name={el.name} number={el.number} />
            <span> </span>
            <button onClick={() => handleDeletePerson(el.id)}>delete</button>
          </p>
        ))
      ) : (
        <p>No persons found!</p>
      )}
    </>
  );
}
