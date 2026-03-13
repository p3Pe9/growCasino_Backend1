const express=require('express')
const {register, login, whoami, logout}=require('../controllers/userController.js')
const{auth}=require('../middleware/userMiddleware')
const { deleteUser } = require("../controllers/userController")

const router=express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/whoami',auth, whoami)
router.post('/logout', auth, logout)
router.delete("/delete-user/:UserID", deleteUser)

module.exports=router