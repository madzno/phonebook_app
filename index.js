require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));

let persons = [];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  let body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' });
  } else if (!body.number) {
    return response.status(400).json({ error: 'number missing' });
  }

  // else if (nameNotUnique(body.name)) {
  //   return response.status(400).json({ error: 'must use unique name' });
  // }

  let newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson);
  })

})

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ];

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

// app.get('/info', (request, response) => {
//   let numberOfPersons = persons.length;
//   let currentTime = new Date();
//   response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>
//   <p>${currentTime}</p>`)
// })

// app.get('/api/persons/:id', (request, response) => {
//   let id = Number(request.params.id);
//   let person = persons.find(person => person.id === id);

//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// })

// app.delete('/api/persons/:id', (request, response) => {
//   let id = Number(request.params.id);
//   persons = persons.filter(person => person.id !== id);

//   response.status(204).end();
// })

// const generateId = () => {
//   let maxId = persons.length > 0
//     ? Math.max(...persons.map(person => person.id))
//     : 0
//   return maxId + 1;
// }

// const nameNotUnique = (providedName) => {
//   let names = persons.map(person => person.name);
//   return names.includes(providedName);
// }

// app.post('/api/persons', (request, response) => {
//   let body = request.body;

//   if (!body.name) {
//     return response.status(400).json({ error: 'name missing' });
//   } else if (!body.number) {
//     return response.status(400).json({ error: 'number missing' });
//   } else if (nameNotUnique(body.name)) {
//     return response.status(400).json({ error: 'must use unique name' });
//   }

//   let newPerson = {
//     id: generateId(),
//     name: body.name,
//     number: body.number,
//   }

//   persons = persons.concat(newPerson);

//   response.json(newPerson);

// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(process.env.PORT)
  console.log(`Server running on port ${PORT}`)
})


