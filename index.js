const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456",
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345",
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
  }
]

//========== API

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const id = +req.params.id

  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const generateId = () => Math.floor(Math.random() * 10000)

app.post('/api/persons', (req, res) => {
  const body = req.body
  const duplicate = persons.some(p => p.name === body.name)
  
  const sendError = (message) =>
        res.status(400).json({ error: message })
  
  if (!body.name) {
    return sendError('"name" must not be empty')
  } else if (!body.number) {
    return sendError('"number" must not be empty')
  } else if (duplicate) {
    return sendError('"name" must be unique')
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

//========== Info

app.get('/info', (req, res) => {
  const number = `Phonebook has info for ${persons.length} people.`
  const time = new Date().toString()
  const info = `<p>${number}</p><p>${time}</p>`
  
  res.send(info)
})

//========== Run server

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
