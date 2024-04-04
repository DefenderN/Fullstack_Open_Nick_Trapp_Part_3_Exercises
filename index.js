//import dotenv library to handle environment variables
require('dotenv').config()
//import Express library
const express = require('express')
//import morgan middleware logging library
const morgan = require('morgan')
//import cors middleware to allow Cross ORigin Sharing
const cors = require('cors')
//import person library to access the MongoDB
const Person = require(`./models/person`)

// create express application and store it in the app variable
const app = express()


// Add cors middleware
app.use(cors())
// Add middleware to parse JSON bodies
app.use(express.json());
// Add middleware to return file from dist directory for any valid http GET request
app.use(express.static('dist'))
// Add morgan middleware to log stuff
// create body token to access POST request data
morgan.token('body', (req, res) =>{
  // return the request body of POST requests ONLY
  if (req.method === 'POST' || req.method === `PUT`) {
    return JSON.stringify(req.body)
  } 
  // return an empty string for every other request method
  else {
    return "";
  }
})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))


// raw server data (for the time being)
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Hellow World! example
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//Get all persons from MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Get single person by providing its id from MongoDB
app.get("/api/persons/:id", (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    // Handle a request for a person that does not exist
    if (person) {
      response.json(person)
    } 
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// Delete single person by providing its id from MongoDB
app.delete("/api/persons/:id", (request, response) => {

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add a single person to MongoDB
app.post("/api/persons", (request, response, next) => {

  //Assign input data to more understandable variable names
  const name = request.body.name
  const number = request.body.number

  //check that the provided name and number are truthy
  //return 400 and an error message if that is not the case
  if (!name || !number) {
    return response.status(400).json({error: 'Invalid request. Check your request data and try again.'});
  }

  // Create new person object by using the request data
  const person = new Person({
    name: name,
    number: number
  })
  
  // POST to MongoDB people collection.
  person.save()
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => next(error))
})

// Update an existing person

app.put("/api/persons/:id", (request, response) => {

  const newPersonObject = {
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPersonObject, {new: true} )
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
});


// Server Info returns the number of persons in the MongoDB
app.get("/info", (request, response) => {

    // log the current time stamp
    const now = new Date().toString();
    

    // get number of persons in the "phonebook"
    
    Person.find({}).then(persons => {
      let numberOfPersons = persons.length;

      //put together response string
      let responseString = `<p>Phonebook contains info for ${numberOfPersons} persons.</p>
      <p> TIME: ${now} </p>`;

      response.send(responseString)
    })
})

// Middlewares defined AFTER our routes 
// Add middleware to handle requests to nonexisting endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error Handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === `CastError`) {
    return response.status(400).send({error: `Malformatted id`})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  // Pass the error to the next middleware
  next(error)
}

// Use errorHandler middleware as the LAST middleware to be loaded
// and BEHIND every route definition
app.use(errorHandler)

// Use the environment variable PORT 
// or port 3001 if the environment variable PORT is undefined
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})