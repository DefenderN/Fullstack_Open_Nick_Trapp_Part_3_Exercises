// import mongoose
const mongoose = require(`mongoose`)

// setup mongoose
mongoose.set(`strictQuery`, false)

// URI of MongoDB
const url = process.env.MONGODB_URI

// logging
console.log(`connecting to`, url)

// Connect to DB
mongoose.connect(url)
    .then(result => {
        console.log(`Connected to MongoDB`)
    })
    .catch(error => {
        console.log(`error connecting to MongoDB:`, error.message)
    })

// Define person Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
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
//The first argument is the name of the collection (in singular) and the second argument seems to be the schema.
// (to ensure that it throws an error or something if you use a wrong schema in your application)
// and
// Export this constructor to use outside of this module.
// This way all the variables inside this module stay hidden from the outside!
module.exports = mongoose.model('Person', personSchema)
