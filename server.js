const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: false }))

app.use('/api/items', require('./routes/itemRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//To test if backend is running
app.get('/test', (req, res) => { res.send('Hello! Express server is running!')})

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
})

app.use(errorHandler)
