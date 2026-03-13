const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findByEmail, createUSer, deleteUserDb, findUserById } = require('../models/userModel.js')
const { config } = require('../config/dotenvConfig')

const cookieOpts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
}
//register
async function register(req, res) {
    try {
        const { email, username, psw, psw2 } = req.body
        //console.log(email,username,psw);

        if (!email || !username || !psw || !psw2) {
            return res.status(400).json({ error: 'Töltsd ki az összes mezőt!' })
        }
        const exists = await findByEmail(email)

        if (psw!=psw2) {
            return res.status(400).json({error:'A két jelszó nem egyezik'})
        }

        //console.log(exists);
        if (exists) {
            return res.status(409).json({ error: 'már van ilyen felhasznalo' })
        }
        const hash = await bcrypt.hash(psw, 10)
        //console.log(hash);
        const { insertId } = await createUSer(username, email, hash)
        //console.log(insertId);

        return res.status(201).json({ message: 'Sikeres regisztráció!', insertId })
    } catch (err) {
        return res.status(500).json({ error: 'Regisztrációs hiba', err })
    }
}
//login
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
            { UserID: exists.UserID, email: exists.Email, username: exists.Username, role: exists.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        //console.log(token);
        console.log(config.COOKIE_NAME);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({ message: 'Sikeres login' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Belépési hiba', err })
    }


}

async function whoami(req,res){
    try {
        const {UserID, username, email, role}=req.user
        console.log(UserID, username, email,role);
        return res.status(200).json({UserID: UserID, Username: email, Email:email, role:role})
        
    } catch (error) {
        return res.status(500).json({error: 'whoami server oldali hiba'})
    }
    
}

async function logout(req,res){

    try {
        return res.clearCookie(config.COOKIE_NAME, {path:'/'}).status(200).json({message:'Sikeres kijelentkezés'})
    } catch (error) {
        return res.status(500).json({error: 'logout server oldali hiba'})
    }
}

async function deleteUser(req, res) {

    try {

        const { UserID } = req.params
        // console.log(UserID);
        const exists = await findUserById(UserID)
        // console.log(exists);
        // console.log(exists);
        if (exists.length == 0) {
            // console.log('asd');
            return res.status(404).json({ error: "Nincs ilyen felhasználó" })
        }

        await deleteUserDb(UserID)

        return res.status(201).json({
            message: "Felhasználó törölve"
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            error: "Törlési hiba",
            err
        })

    }

}

module.exports = { register, login, whoami, logout, deleteUser }