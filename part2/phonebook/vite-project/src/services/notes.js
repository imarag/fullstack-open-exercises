import axios from "axios"
const baseUrl = "http://localhost:3001/persons"

const getAllPersons = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data)
}

const createPerson = (newPerson) => {
    const request = axios.post(baseUrl, newPerson);
    return request.then(response => response.data)
}

const updatePerson = (personId, newPerson) => {
    const request = axios.put(`${baseUrl}/${personId}`, newPerson);
    return request.then(response => response.data)
}

const deletePerson = (personId) => {
    const request = axios.delete(`${baseUrl}/${personId}`);
    return request.then(response => response.data)
}

export default {
    getAllPersons,
    createPerson,
    updatePerson,
    deletePerson
}