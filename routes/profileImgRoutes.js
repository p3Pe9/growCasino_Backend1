const express = require("express")
const{auth}=require('../middleware/userMiddleware')
const {upload}=require('../middleware/uploadProfileImage')
const router = express.Router()
const { uploadProfileImage } = require("../controllers/profileImgController")

router.post('/upload-pfp/:id', auth, upload.single('pfp') ,uploadProfileImage)

module.exports = router