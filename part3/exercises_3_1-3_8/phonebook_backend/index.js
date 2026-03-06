express = require("express")
var morgan = require('morgan')

app = express()
app.use(express.static('dist'))
app.use(express.json())
morgan.token("body", (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]


app.get("/api/persons", (request, response) => {
    return response.json(persons)
})

app.get("/info", (request, response) => {
    const totalPeople = persons.length
    const currentTime = String(new Date())
    return response.type("text").send(`Phonebook has info for ${totalPeople} people\n${currentTime}`)
})

app.get("/api/persons/:id", (request, response) => {
    const personId = request.params.id
    const person = persons.find(item => item.id === personId)
    if (!person) {
        return response.status(404).send()
    }

    return response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
    const personId = request.params.id
    persons = persons.filter(el => el.id !== personId)
    return response.status(204).end()
})

function generateRandomId() {
    let idString = ""
    for (let i = 0; i <= 6; i++) {
        const randomNumber = Math.floor((Math.random() * 9) + 1)
        idString += randomNumber
    }
    return idString
}

app.post("/api/persons", (request, response) => {
    body = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({ error: "Name or phone number is missing!" })
    }

    const existingName = persons.find(el => el.name === body.name)

    if (existingName) {
        return response.status(404).json({ error: "name must be unique" })
    }

    const newPerson = {
        "name": body.name || "Person Name",
        "number": body.number || "00000000",
        "id": generateRandomId()
    }

    persons = [...persons, newPerson]

    return response.json(newPerson)
})


app.put("/api/persons/:id", (request, response) => {
    const body = request.body
    const personId = request.params.id

    if (!body.name || !body.number) {
        return response.status(404).json({ error: "Name or phone number are missing!" })
    }

    const newPerson = {
        "name": body.name || "Person Name",
        "number": body.number || "00000000",
        "id": personId
    }

    persons = persons.map(person => person.id === personId ? newPerson : person)

    return response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})