require('dotenv').config()

const express = require('express')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT
const HOST = process.env.HOST
const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.use(express.json())

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'Z',
    connectionLimit: 10,
    queueLimit: 0
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/regisztracio', async (req, res) => {
    try {
        const { email, username, psw } = req.body
        //console.log(email, username, psw);

        if (!email || !username || !psw) {
            return res.status(400).json({ error: 'Töltsd ki az összes mezőt!' })
        }

        const hash = await bcrypt.hash(psw, 10)
        console.log(hash);

        const sql = 'INSERT INTO `user` (`UserID`, `PFP`, `Psw`, `Balance`, `Username`, `Email`, `Created_at`) VALUES (NULL, "nincs", ?, "0", ?, ?, current_timestamp())'
        const [result] = await db.query(sql, [hash, username, email])
        //console.log(result);

        return res.status(201).json({ message: 'Sikeres regisztráció', userId: result.insertId })
    } catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Az email vagy a username már foglalt' })
        }

        return res.status(500).json({ error: 'Szerver hiba!', err })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, psw } = req.body
        //console.log(email, psw);
        if (!email || !psw) {
            return res.status(400).json({ error: 'Töltsd ki az összes mezőt!' })
        }

        const sql = 'SELECT * FROM user WHERE Email = ?'
        const [result] = await db.query(sql, [email])
        //console.log(result);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Hibás email' })
        }

        const user = result[0]

        const ok = await bcrypt.compare(psw, user.Psw)
        console.log(ok);
        if (!ok) {
            return res.status(401).json({ error: 'Hibás jelszó' })
        }
        
        const token = createToken(user.UserID)
        console.log(token);

        return res.status(200).json({ message: 'Sikeres bejelentkezés', token })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Szerver hiba!', err })
    }
})

app.listen(PORT, HOST, () => {
    console.log(`A szerver itt fut: http://${HOST}:${PORT}`)
})