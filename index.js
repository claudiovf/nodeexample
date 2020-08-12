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

app.get('/api/notes/:id', (req,res) => {
    Note.findById(request.params.id).then(note => {
        res.json(note)
    })
})

//..notes.map will return values to Math instead of an array
//like notes.map would

app.post('/api/notes', (req, res) => {
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
        .then(savedNote => {
            res.json(savedNote)
        })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    console.log(id, notes)

    res.status(204).end()
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
