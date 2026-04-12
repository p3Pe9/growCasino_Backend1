const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findByEmail, createUSer, deleteUserDb, findUserById, updateUsernameById, updatePasswordById } = require('../models/userModel.js')
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
        const { email, username, psw} = req.body
        console.log(email,username,psw);

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

        //console.log(exists);
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
        //console.log(config.COOKIE_NAME);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({ message: 'Sikeres login' })
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ error: 'Belépési hiba', err })
    }


}

async function whoami(req, res) {
    try {
        const { UserID, username, email, role } = req.user
        console.log(UserID, username, email, role);
        return res.status(200).json({ UserID: UserID, Username: username, Email: email, role: role })

    } catch (error) {
        return res.status(500).json({ error: 'whoami server oldali hiba' })
    }

}

async function logout(req, res) {

    try {
        return res.clearCookie(config.COOKIE_NAME, { path: '/' }).status(200).json({ message: 'Sikeres kijelentkezés' })
    } catch (error) {
        return res.status(500).json({ error: 'logout server oldali hiba' })
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

        return res.status(200).json({
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

async function updateUsername(req, res) {

    try {

        const { userId, username } = req.body

        if (!userId || !username) {
            return res.status(400).json({ error: "UserID és username kötelező" })
        }

        const exists = await findUserById(userId)

        if (!exists) {
            return res.status(404).json({ error: "Nincs ilyen felhasználó" })
        }

        await updateUsernameById(userId, username)

        return res.status(200).json({
            message: "Username sikeresen módosítva"
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            error: "Username módosítási hiba"
        })

    }

}

async function updatePassword(req, res) {
    try {

        const { oldPassword, newPassword } = req.body
        const userId = req.user.UserID
        // console.log(userId);

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                error: "Minden mező kötelező"
            })
        }

        const user = await findUserById(userId)
        // console.log(user);
        // console.log(user.Psw);
        // console.log(ok);
        const ok = await bcrypt.compare(oldPassword, user.Psw)
        // console.log(config.JWT_SECRET);
        // console.log(oldPassword, user.Psw);
        // console.log(ok);
        if (!ok) {
            return res.status(401).json({
                error: "Régi jelszó hibás"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await updatePasswordById(userId, hashedPassword)

        res.status(200).json({
            message: "Jelszó módosítva"
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: "Jelszó módosítás hiba"
        })

    }
}

module.exports = { register, login, whoami, logout, deleteUser, updateUsername, updatePassword }