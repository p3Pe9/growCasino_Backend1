const express = require('express')
const cors=require('cors')
const app=express()

const userRoutes=require('./routes/userRoutes.js')
const cookieParser = require('cookie-parser')
const profileImgRoutes=require('./routes/profileImgRoutes.js')

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/users', userRoutes)
app.use('/api/profile-images',profileImgRoutes)

module.exports=app