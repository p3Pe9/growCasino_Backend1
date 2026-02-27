const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findByEmail, createUSer } = require('../models/userModel.js')
const { config } = require('../config/dotenvConfig')

const cookieOpts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
}

async function register(req, res) {
    try {
        const { email, username, psw } = req.body
        //console.log(email,username,psw);

        if (!email || !username || !psw) {
            return res.status(400).json({ error: 'Töltsd ki az összes mezőt!' })
        }
        const exists = await findByEmail(email)

        //console.log(exists);
        if (exists) {
            return res.status(409).json({ error: 'már van ilyen felhasznalo' })
        }
        const hash = await bcrypt.hash(psw, 10)
        //console.log(hash);
        const { insertId } = await createUSer(username, email, hash)
        console.log(insertId);

        return res.status(201).json({ message: 'Sikeres regisztráció!', insertId })
    } catch (err) {
        return res.status(500).json({ error: 'Regisztrációs hiba', err })
    }
}

async function login(req, res) {
    try {
        const { email, psw } = req.body
        //console.log(email,psw); 
        if (!email || !psw) {
            return res.status(400).json({ error: 'Email és jelszó kötelező' })
        }
        const exists = await findByEmail(email)

        console.log(exists);
        if (!exists) {
            return res.status(401).json({ error: 'még nincs ilyen felhasználó' })
        }
 
        const ok = await bcrypt.compare(psw, exists.Psw)
        //console.log(ok);
        if (!ok) {
            return res.staus(400).json({ error: 'Belépési hiba' })
        }

        const token = jwt.sign(
            { user_id: exists.user_id, email: exists.email, username: exists.username, role: exists.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        //console.log(token);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({ message: 'Sikeres login' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Belépési hiba', err })
    }


}



module.exports = { register, login }