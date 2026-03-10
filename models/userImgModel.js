const db = require("../db/db")

const updateProfileImage = async (userId, imageName) => {

    const sql = "UPDATE users SET PFP = ? WHERE UserID = ?"

    const [result] = await db.execute(sql, [imageName, userId])

    return result
}

module.exports = {
    updateProfileImage
}