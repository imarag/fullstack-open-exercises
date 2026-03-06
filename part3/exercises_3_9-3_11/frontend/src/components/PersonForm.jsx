export default function PersonForm({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  handleSubmitForm,
}) {
  return (
    <form onSubmit={handleSubmitForm}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          type="tel"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
