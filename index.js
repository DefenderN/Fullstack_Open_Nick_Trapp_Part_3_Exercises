//import Express library
const express = require('express')
// create express application and store it in the app variable
const app = express()

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


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//return hardcoded string of persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// reutrn individual person information
app.get("/api/persons/:id", (request, response) => {
  // get id and convert to number to use as comparator
  const id = Number(request.params.id)

  // Find id entry in persons array and return the person
  // or return 404 if no entry for the id exists
  const person = persons.find(person => person.id === id)
  
  // Handle a request for a person that does not exist
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//delete person by providing an id
app.delete("/api/persons/:id", (request, response) => {

  //get id of person to be deleted
  const id = Number(request.params.id)
  console.log("ID to remove is:", id)
  // delete entry with matching id
  persons = persons.filter(person => person.id !== id)
  
  //return response message
  response.send(`Person with id ${id} will be deleted`)
})

//Server Info
app.get("/info", (request, response) => {

    // log the current time stamp
    const now = new Date().toString();
    
    // get number of persons in the "phonebook"
    let numberOfPersons = persons.length;

    //put together response string
    let responseString = `<p>Phonebook contains info for ${numberOfPersons} persons.</p>
    <p> TIME: ${now} </p>`;

    response.send(responseString)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})