require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())

//========== API

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  
  const person = {
    name: body.name,
    number: body.number,
  }
  
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  // NOTE: Checking for duplicates deleted in ex. 3.17.
  // const duplicate = persons.some(p => p.name === body.name)
  
  const sendError = (message) =>
        res.status(400).json({ error: message })
  
  if (!body.name) {
    return sendError('"name" must not be empty')
  } else if (!body.number) {
    return sendError('"number" must not be empty')
  }
  // } else if (duplicate) {
  //   return sendError('"name" must be unique')
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })  
    .catch(err => next(err))
})

//========== Info

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const number = `Phonebook has info for ${count} people.`
      const time = new Date().toString()
      const info = `<p>${number}</p><p>${time}</p>`
  
      res.send(info)
    })
    .catch(err => next(err))
})

//========== Error handling

app.use((err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    // Invalid object ID for Mongo
    res.status(400).send({ error: 'malformatted id' })
  } else {
    // The default Express error handler
    next(err)
  }
})

//========== Run server

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
