require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

console.log("Connected to the database...")

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

app.get("/api/persons", (request, response) => {
    Person.find({})
        .then(docs => {
            return response.json(docs)
        })
})


app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                return response.json(person)
            }
            else {
                return response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    const personId = request.params.id
    Person.findByIdAndDelete(personId)
        .then(deletedPerson => {
            console.log(`Deleted person with id: ${personId}`)
            return response.status(204).end()
        })
        .catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => {
    body = request.body

    const newPerson = new Person({
        "name": body.name || "Person Name",
        "number": body.number || "00000000"
    })

    newPerson.save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
        .catch(error => next(error))

})

app.get("/info", (request, response) => {
    Person.countDocuments({}).then(totalPeople => {
        const currentTime = String(new Date())
        return response.type("text").send(`Phonebook has info for ${totalPeople} people\n${currentTime}`)
    })
})

app.put("/api/persons/:id", (request, response) => {
    const { name, number } = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({ error: "Name or phone number are missing!" })
    }

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            person.save().then((updatedPerson) => {
                return response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name == 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})