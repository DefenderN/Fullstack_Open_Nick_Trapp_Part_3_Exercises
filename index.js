//import Express library
const express = require('express')
// create express application and store it in the app variable
const app = express()

// Middleware to parse JSON bodies
app.use(express.json());

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

//return all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// return an individual person by providing its id
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

//delete a single person by providing its id
app.delete("/api/persons/:id", (request, response) => {

  //get id of person to be deleted
  const id = Number(request.params.id)
  console.log("ID to remove is:", id)
  // delete entry with matching id
  persons = persons.filter(person => person.id !== id)
  
  //return response message
  response.send(`Person with id ${id} will be deleted`)
})

//Add a single person
app.post("/api/persons", (request, response) => {

  let name = request.body.name
  let number = request.body.number
  let id = Math.floor(Math.random() * 10000) + 1;

  let newPerson = {
    "id": id,
    "name": name,
    "number": number,
  }
  //check that the provided name and number are truthy
  if (name && number){
    let newArrayLength = persons.push(newPerson)
    
    // Assuming successful processing
    // Respond with a 200 OK status code and a JSON object indicating success
    response.status(200).json({ message: 'Data received successfully', addedPerson: newPerson });
  }
  else {
    response.status(400).json({ error: 'Invalid request. Check your request data and try again.' });
  }
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