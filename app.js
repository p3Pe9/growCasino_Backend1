const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const userRoutes = require('./routes/userRoutes.js')
const profileImgRoutes = require('./routes/profileImgRoutes.js')
const minesRoutes = require('./routes/minesRoutes')

app.use(cors({
    origin: ['http://localhost:5173', 'https://growkaszi.netlify.app'],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/mines', minesRoutes)
app.use('/api/profile-images', profileImgRoutes)

module.exports = app