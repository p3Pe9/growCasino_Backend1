const {getBalance} = require('../models/userModel')

async function getUserBalance(req, res) {
    try {
        const userId = req.user.UserID

        const user = await getBalance(userId)

        res.json({
            balance: user.Balance
        })

    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
}

module.exports = {getUserBalance}