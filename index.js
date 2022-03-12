const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())

morgan.token('postContent', function (req, res) { 
    let x = JSON.stringify(req.body)
    if (x) {
    return x 
    } else return null
    })

    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))

let genId = () => {
    let id = Math.floor(Math.random() * 1000)
    return id
}

let contacts = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
    res.send('<h1>Täh</h1>')
})

app.get('/api/contacts', (req, res) => {
    res.json(contacts)
})

app.get('/info', (req, res) => {
    let bookLength = contacts.length
    let date = new Date()
    res.send(`<p>The phonebook has ${bookLength} contacts</p><br><p>${date}</p>`)
})

app.get('/api/contacts/:id', (req, res) => {
    let id = Number(req.params.id)
    let contact = contacts.find(contact => contact.id === id)
    if (contact) {
        res.send(contact)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/contacts/:id', (req, res) => {
    let id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    res.status(204).end()
})

app.post('/api/contacts', (req, res) => {
    let body = req.body
    if (!body.name || !body.number) {
       return res.status(400).json({
            error: 'contact missing name or number'
        }).end()
    }
    let newContact = {
        name: body.name,
        number: body.number,
        id: genId()
    }
    contacts = contacts.concat(newContact)
    res.json(newContact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})