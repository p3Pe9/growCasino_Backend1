const db = require("../db/db")

const updateProfileImage = async (UserID, imageName) => {

    const sql = "UPDATE user SET PFP = ? WHERE UserID = ?"

    const [result] = await db.execute(sql, [imageName, UserID])

    return result
}

module.exports = {
    updateProfileImage
}