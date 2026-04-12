const userImgModel = require("../models/userImgModel")

const uploadProfileImage = async (req, res) => {

    try {

        const userId = req.params.id
        // console.log(userId);
        if (!req.file) {
            return res.status(400).json({
                message: "Nincs kép feltöltve"
            })
        }

        const imageName = req.file.filename

        await userImgModel.updateProfileImage(userId, imageName)

        res.status(201).json({
            message: "Sikeres feltöltés",
            file: imageName
            
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: "Szerver hiba"
        })

    }

}

module.exports = {uploadProfileImage}