const jwt=require('jsonwebtoken')
const {config}=require('../config/dotenvConfig')
const { getUserBalance } = require('../controllers/balanceController')

async function auth(req, res, next){

    const token=req.cookies?.[config.COOKIE_NAME] 

    if (!token) {
        return res.status(401).json({error: "Nincs cookie"})
    }
    try {
        req.user=jwt.verify(token, config.JWT_SECRET)

        next()
    } catch (err) {
        return res.status(401).json({error:'Érvénytelen token'})
    }
}

function authMiddleware(req, res, next) {
    console.log(req.body);
    try {
        //console.log(req.headers.cookie.split('token=')[1]);
        const token = req.cookies?.[config.COOKIE_NAME] 

        if (!token) {
            return res.status(401).json({ msg: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded,
        
        console.log(req.body);
        next()

    } catch (err) {
        console.log(err);
        return res.status(401).json({ msg: 'Invalid token' })
    }

}


module.exports={auth, authMiddleware}