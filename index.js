//import Express library
const express = require('express')
// create express application and store it in the app variable
const app = express()

// raw server data (for the time being)
let notes = [
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
  response.json(notes)
})

app.get("/info", (request, response) => {

    // log the current time stamp
    const now = new Date().toString();
    
    // get number of persons in the "phonebook"
    let numberOfPersons = notes.length;

    //put together response string
    let responseString = `<p>Phonebook contains info for ${numberOfPersons} persons.</p>
    <p> TIME: ${now} </p>`;

    response.send(responseString)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})