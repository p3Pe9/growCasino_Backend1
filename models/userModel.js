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

module.exports = { findByEmail, createUSer }