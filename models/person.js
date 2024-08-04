const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Connect

const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err.message)
  })

// Make a model

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 chars long.'],
    required: [true, 'Name required.'],
  },
  number: {
    type: String,
    minLength: [8, 'Number must be at least 8 chars long.'],
    required: [true, 'Number required.'],
    validate: {
      validator: v => /^\d{2,3}-\d*$/.test(v),
      message: props => `${props.value} is not a valid phone number.`
    },
  },
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
