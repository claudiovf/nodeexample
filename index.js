require('dotenv').config() //must be imported before Note

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(cors())

//json parsing
app.use(express.json())
app.use(express.static('build'))



app.get('/api/notes', (req,res) => {
    Note
        .find({})
        .then(notes => {
            res.json(notes)
        })
})

app.get('/api/notes/:id', (req,res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if(note) {
                res.json(note)
            }else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

//..notes.map will return values to Math instead of an array
//like notes.map would

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    
    if(!body.content) {
        // must return otherwise it will run to the end
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    note
        .save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormatted => {
            res.json(savedAndFormatted)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Notes.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body
    
    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(req.body.id, note, {new: true})
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if(error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
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
