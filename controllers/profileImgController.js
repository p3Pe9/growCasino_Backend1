const userImgModel = require("../models/userImgModel")

const uploadProfileImage = async (req, res) => {

    try {

        const userId = req.params.id

        if (!req.file) {
            return res.status(400).json({
                message: "Nincs kép feltöltve"
            })
        }

        const imageName = req.file.filename

        await userImgModel.updateProfileImage(userId, imageName)

        res.json({
            message: "Profil kép modosult",
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