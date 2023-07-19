require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  let body = request.body

  let newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    let numberOfPersons = persons.length
    let currentTime = new Date()
    response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  let body = request.body

  let person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, content: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(process.env.PORT)
  console.log(`Server running on port ${PORT}`)
})


