express = require("express")
var morgan = require('morgan')

app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
},
    {
        skip: function (req, res) { return req.method.toUpperCase() !== "POST" }
    }
))

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
        return response.status(404).json({ error: "Name or phone number are missing!" })
    }

    const existingName = persons.find(el => el.name === body.name)

    if (existingName) {
        return response.status(404).json({ error: "The provided name already exists!" })
    }

    const newPerson = {
        "name": body.name || "Person Name",
        "number": body.number || "00000000",
        "id": generateRandomId()
    }

    return response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})