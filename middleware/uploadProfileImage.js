const multer=require('multer')
const fs=require('fs')
const path=require('path')

const MAX_FILE_SIZE=1024*1024*10

const storage=multer.diskStorage({
    destination:(req, file,cb)=>{
        const {UserID}=req.params
        if (!UserID) {
            return cb(new Error('Hiányzik a user azonosító'), null)
        }

        const uploadDir=path.join(process.cwd(), 'uploads', String(zsuri_id))

        try {
            fs.mkdirSync(uploadDir, {recursive: true})
            cb(null, uploadDir)
            
        } catch (err) {
            return cb(new Error('Nem sikekült létrehozni a mappát', null))
        }
    },

    filename: (req, file, cb)=>{
        const  {UserID}=req.user
        if (!UserID) {
            return cb(new Error('Nincs bejelentkezve'), null)
        }
        const now=new Date().toISOString().split('T')[0]

        return cb(null, `${UserID}-${now}-${file.originalname}`)
    }
})

const upload= multer({
    storage:storage,
    limits:{fileSize: MAX_FILE_SIZE},
    fileFilter:(req,file, cb)=>{
        const fileTypes=/jpg|jpeg|png|gif|svg|svg|webp|avif|bmp|tiff|jfif/
        const extName=fileTypes.test(path.extname(file.originalname).
        toLowerCase())
        console.log(extName);
        const mimeType=fileTypes.test(file.mimetype)
        
        if (extName && mimeType) {
            return cb(null,true)
        }

        return cb(new Error('Csak képformátumok', null))
    }
})

module.exports={upload}