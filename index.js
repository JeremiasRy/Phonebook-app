require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/mongoose.js')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postContent', function (req, res) { 
    let x = JSON.stringify(req.body)
    if (x) {
    return x 
    } else return null
    })


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postContent'))

app.get('/', (req, res) => {
    res.send('<h1>Täh</h1>')
})

app.get('/api/contacts', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})

app.get('/info', (req, res) => {
    Contact.find({})
    .then(contact => {
        console.log(contact)
        let date = new Date()
        res.send(`<p>The phonebook has ${contact.length} contacts</p><br><p>${date}</p>`)
    })
})

app.get('/api/contacts/:id', (req, res, next) => {
    Contact.findById(req.params.id)
    .then(contact => {
        if (contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/contacts/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
    .then(response => {
        res.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/contacts', (req, res, next) => {
    let body = req.body
    let newContact = new Contact ({
        name: body.name,
        number: body.number,
    })
    newContact.save().then(result => {
        res.json(newContact)
    })
    .catch(error => next(error))
})

app.patch('/api/contacts/:id', (req, res) => {
    let body = req.body
    let upContact = {
        name: body.name,
        number: body.number
    }
    Contact.findByIdAndUpdate(req.params.id, upContact) 
    .then(upContact => {
        res.json(upContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})