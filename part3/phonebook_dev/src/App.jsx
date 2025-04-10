import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import personsAPI from "./services/personsAPI";

import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsAPI.getAllPersons().then((data) => {
      setPersons(data);
    });
  }, []);

  function handleSubmitForm(e) {
    e.preventDefault();

    const currentPerson = persons.find((el) => el.name === newName);

    if (currentPerson && newNumber === currentPerson.number) {
      alert(
        `${newName} is already added to phonebook with that number and name!`
      );
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (currentPerson) {
      const userExistsConfirmation = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one ?`
      );
      if (!userExistsConfirmation) {
        return;
      } else {
        personsAPI
          .updatePerson(currentPerson.id, newPerson)
          .then((data) => {
            setPersons(
              persons.map((updatedPerson) =>
                updatedPerson.id === currentPerson.id ? data : updatedPerson
              )
            );
            setSuccessMessage(`Updated ${data.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error.message);
            setErrorMessage(
              `Information for ${newName} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
        return;
      }
    }

    personsAPI
      .createPerson(newPerson)
      .then((createdPerson) => {
        setPersons([...persons, createdPerson]);
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`Added ${createdPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        const errorMessage = error.response.data.error;
        setErrorMessage(errorMessage);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }

  function handleDeletePerson(personId) {
    const personToDelete = persons.find((person) => person.id === personId);
    const deleteConfirm = window.confirm(`Delete ${personToDelete.name} ?`);
    if (!deleteConfirm) {
      return;
    }
    personsAPI.deletePerson(personId).then((res) => {
      const newPersons = persons.filter((person) => person.id !== personId);
      setPersons(newPersons);
    });
  }

  const filteredPersons = persons.filter((el) => {
    const nameLower = el.name.toLocaleLowerCase();
    const searchParamLower = searchParam.toLocaleLowerCase();
    return nameLower.includes(searchParamLower);
  });

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && (
        <Notification message={successMessage} type="success" />
      )}
      {errorMessage && <Notification message={errorMessage} type="error" />}
      <Filter searchParam={searchParam} setSearchParam={setSearchParam} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleSubmitForm={handleSubmitForm}
      />
      <h3>Numbers</h3>
      <Persons
        personsList={filteredPersons}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
