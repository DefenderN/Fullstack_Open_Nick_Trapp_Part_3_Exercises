// import mongoose
const mongoose = require('mongoose')

// Check for password provided by user
if (process.argv.length < 3) {
  console.log('give password as a third argument: e.g. node mongo.js <yourPassword>')
  process.exit(1)
}

// Assign the password to a variable
const password = process.argv[2]

// hardcoded url path for our database
const url =
  `mongodb+srv://fullstackuser:${password}@fullstackopendb1.qre0tv4.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopendb1`

// setup mongoose (?)
mongoose.set('strictQuery', false)

// connect to db
mongoose.connect(url)

// Create personSchema, which tells mongoDB how to store person objects in the DB
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
// The first argument is the name of the collection (in singular) and the second argument seems to be the schema.
// (to ensure that it throws an error or something if you use a wrong schema in your application)
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  // return all entries of the collection in the db for persons
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  // Create a person object
  const person1 = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  // save the person to the collection in the db on the server
  // By mongoose convention the collection name is the plural of its documents aka person entries:
  // DB Name: Persons
  person1.save().then(result => {
    console.log('Person saved!')
    // IMPORTANT to close connection, otherwise it runs indefinetly
    mongoose.connection.close()
  })
}
