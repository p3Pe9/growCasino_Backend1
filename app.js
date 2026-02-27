const express = require('express')
const cors=require('cors')
const app=express()

const userRoutes=require('./routes/userRoutes.js')
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:'http://localhost:5173/'
}))

app.use('/users', userRoutes)

module.exports=app