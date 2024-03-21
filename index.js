//import Express library
const express = require('express')
//import morgan middleware logging library
const morgan = require('morgan')
//import cors middleware to allo cross origin sharing
const cors = require('cors')

// create express application and store it in the app variable
const app = express()


// Add cors middleware
app.use(cors())
// Add mMiddleware to parse JSON bodies
app.use(express.json());
//Return file from dist directory for any valid http GET request
app.use(express.static('dist'))
// Add morgan Middleware to log stuff
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

//Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Get single person by providing its id
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

// Delete single person by providing its id
app.delete("/api/persons/:id", (request, response) => {

  //get id of person to be deleted
  const id = Number(request.params.id)
  console.log("ID to remove is:", id)
  // delete entry with matching id
  persons = persons.filter(person => person.id !== id)
  
  //return response message
  response.send(`Person with id ${id} will be deleted`)
})

//Add a single person (id will be generated by random(!DANGEROUS))
app.post("/api/persons", (request, response) => {

  //Assign input data easy to read variable names
  let name = request.body.name
  let number = request.body.number
  let id = Math.floor(Math.random() * 10000) + 1;

  //check that the provided name and number are truthy
  //return 400 and an error message if that is not the case
  if (!name || !number) {
    response.status(400).json({error: 'Invalid request. Check your request data and try again.'});
  }

  //check that the name is not already in the phonebook.
  //In that case return an error message aswell, explaining 
  //that the name already exists
  else if (persons.some(person => person.name === name)) {
    response.status(400).json({error: 'The name is already in the phonebook'});
  }

  else {
    console.log("Last statement is called")
    //Create new person object
    let newPerson = {
      "id": id,
      "name": name,
      "number": number,
    }
    //Add new person
    persons.push(newPerson);
    // Respond with 200 OK status code and a success message and
    // the data of the added person
    response.status(200).json(newPerson);
  }
})

// Update an existing person

app.put("/api/persons/:id", (request, response) => {
  console.log("CHECKPOINT 1");
  // get id and convert to number to use as comparator
  const id = Number(request.params.id);

  // Find id entry in persons array 
  // or return 404 if no entry for the id exists
  const person = persons.find(person => person.id === id);
  
  if (person) {
    // IMPORTANT: Grab the new number from the request body
    const newNumber = request.body.number; // This line was missing
    console.log("request body is:", request.body)
    console.log("newNumber is:", newNumber)

    // Modify the person data
    persons = persons.map(arrayPerson => {
      // Use a direct return inside map for cleaner code
      if (arrayPerson.id === id) {
        console.log("Ids are equal");
        // Update the number directly here using the newNumber
        return {...arrayPerson, number: newNumber}; // Modified to use newNumber
      } else {
        return arrayPerson;
      }
    });

    // Respond with the updated person object, not the original
    response.json({...person, number: newNumber}); // Modified to ensure updated info is sent back
  } else {
    // Handle a request for a person that does not exist
    response.status(404).end();
  }
});


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

// Middlewares defined AFTER our routes 
// Add middleware to handle requests to nonexisting endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Use the environment variable PORT 
// or port 3001 if the environment variable PORT is undefined
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})