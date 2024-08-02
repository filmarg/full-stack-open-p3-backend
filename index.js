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

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  // const id = +req.params.id

  Person.findByIdAndDelete(req.params.id)
    .then(person => {
      res.status(204).end()
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  // TODO: To delete, in ex. 3.17.
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

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save()
    .then(savedPerson => {
      res.json(newPerson)
    })  
})

//========== Info

app.get('/info', (req, res) => {
  const number = `Phonebook has info for ${persons.length} people.`
  const time = new Date().toString()
  const info = `<p>${number}</p><p>${time}</p>`
  
  res.send(info)
})

//========== Run server

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
