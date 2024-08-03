const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Connect

const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.connect(url)
  .then(res => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err.message)
  })

// Make a model

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
})

// Alter the model for it to suit our needs
personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
