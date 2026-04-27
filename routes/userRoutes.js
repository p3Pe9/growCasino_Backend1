const express=require('express')
const {register, login, whoami, logout, updateUsername, updatePassword}=require('../controllers/userController.js')
const{auth}=require('../middleware/userMiddleware')
const { deleteUser } = require("../controllers/userController")
const { getUserBalance } = require('../controllers/balanceController')

const router=express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/whoami',auth, whoami)
router.post('/logout', auth, logout)
router.delete("/delete-user/:UserID", deleteUser)
router.put("/update-username", updateUsername)
router.put("/update-password",auth, updatePassword)
router.get('/balance', auth, getUserBalance)
router.post('/deposit', auth, getUserBalance)

module.exports=router