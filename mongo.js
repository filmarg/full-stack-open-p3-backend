const mongoose = require('mongoose')

const args = process.argv

// Validate

if (args.length !== 3 && args.length !== 5) {
  console.log('Invalid number of arguments:', args.length)
  process.exit(1)
}

// Connect and make a model

const url = `mongodb+srv://fso:${args[2]}@cluster0.pkilmvz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Insert into or fetch from the DB

if (args.length === 5) {
  const person = new Person({
    name: args[3],
    number: args[4],
  })

  person.save()
    .then(savedPerson => {
      console.log('Added', savedPerson.name, 'number', savedPerson.number, 'to phonebook')
      mongoose.connection.close()
    })
} else {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(p => console.log(p.name, p.number))
      mongoose.connection.close()
    })
}
