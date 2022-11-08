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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/items', require('./routes/itemRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//To test if backend deployment worked
app.get('/test', (req, res) => { res.send('Hello! Express server is running!')})

//Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')))

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('Please set to production') )
}

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
})

app.use(errorHandler)
