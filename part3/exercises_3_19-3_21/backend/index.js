require('dotenv').config()
const express = require('express')
const morgan = require(morgan)
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      return response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
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

app.delete('/api/persons/:id', (request, response, next) => {
  const personId = request.params.id
  Person.findByIdAndDelete(personId)
    .then(() => {
      return response.status(204).end()
    })
    .catch(error => next(error))
})

function doUpdate(req, res, next) {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or phone number are missing!' })
  }

  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => res.json(updatedPerson))
    })
    .catch(error => next(error))
}

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) return res.status(400).json({ error: 'Name or phone number are missing!' })

  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        req.params.id = existingPerson.id
        return next() // stop here and call doUpdate
      }

      // create new person
      const newPerson = new Person({ name, number })
      return newPerson.save().then(savedPerson => res.json(savedPerson))
    })
    .catch(err => res.status(500).send(err.message))
}, doUpdate)

app.put('/api/persons/:id', doUpdate)

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(totalPeople => {
    const currentTime = String(new Date())
    return response.type('text').send(`Phonebook has info for ${totalPeople} people\n${currentTime}`)
  })
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})