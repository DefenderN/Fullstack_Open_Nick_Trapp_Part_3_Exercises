// import mongoose
const mongoose = require('mongoose')

// setup mongoose
mongoose.set('strictQuery', false)

// URI of MongoDB
const url = process.env.MONGODB_URI

// logging
console.log('connecting to', url)

// Connect to DB
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Define validator functions for person Schema
const validatePhoneNumber = (phoneNumber) => {
  const regEx = /^\d{2,3}-\d{1,}$/
  return regEx.test(phoneNumber)
}

// Define person Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be a minimum of 3 letters']
  },
  number: {
    type: String,
    minLength: [8, 'Number must be a minimum of 8 characters'],
    validate: {
      validator: validatePhoneNumber,
      message: 'The number has to be of format 123-1234... or 12-1234....'
    }
  }
})

// Use the transform function to modify the toJSON option of Mongoose.
// Here it adds the .id field to the object when it is converted into JSON
// and removes the unwanted properties such as _id and __v.
// Note: It only modifies the object that is passed to the toJSON function
// It DOES NOT modify the DB entry at all!
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create fancy Constructor for the person(s) using the personSchema
// The first argument is the name of the collection (in singular) and the second argument seems to be the schema.
// (to ensure that it throws an error or something if you use a wrong schema in your application)
// and
// Export this constructor to use outside of this module.
// This way all the variables inside this module stay hidden from the outside!
module.exports = mongoose.model('Person', personSchema)
