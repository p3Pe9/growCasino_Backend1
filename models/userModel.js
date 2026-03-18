const db = require('../db/db.js')

async function findByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email=?'
    const [result] = await db.query(sql, [email])
    //console.log(result);
    return result[0] || null
}

async function createUSer(username, email, hash) {
    const sql = 'INSERT INTO `user` (`UserID`, `PFP`, `Psw`, `Balance`, `Username`, `Email`, `Created_at`) VALUES (NULL, "0", ?, "0", ?, ?, current_timestamp())'
    const [result] = await db.query(sql, [hash, username, email])
    return { insertId: result.insertId }
}

async function deleteUserDb(UserID){
    const sql='DELETE FROM `user` WHERE UserID=?'
    const [result] = await db.execute(sql, [UserID])

    return result
}


async function findUserById(UserID){
    const sql='Select * FROM `user` WHERE UserID=?'
    const [result] = await db.query(sql, [UserID])
    return result[0]
}

async function updateUsernameById(userId, username) {

    const sql = `
        UPDATE user
        SET Username = ?
        WHERE UserID = ?
    `

    const [result] = await db.execute(sql, [username, userId])

    return result
}


async function updatePasswordById(userId, password) {

    const sql = `
        UPDATE user
        SET Psw = ?
        WHERE UserID = ?
    `

    const [result] = await db.execute(sql, [password, userId])

    return result
}

module.exports = {
    updatePasswordById
}

module.exports = { findByEmail, createUSer, deleteUserDb, findUserById, updateUsernameById,updatePasswordById }