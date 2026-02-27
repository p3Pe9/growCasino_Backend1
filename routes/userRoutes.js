const express=require('express')
const {register, login}=require('../controllers/userController.js')
const{auth}=require('../middleware/userMiddleware')

const router=express.Router()

router.post('/register', register)
router.post('/login', login)

module.exports=router