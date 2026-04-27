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
async function depositBalance(req, res) {
    try {
        const userId = req.user.UserID
        const amount = Number(req.body.amount)

        if (!amount || amount <= 0) {
            return res.status(400).json({
                msg: 'Invalid amount'
            })
        }

        await updateBalance(userId, amount)

        res.json({
            msg: 'Balance updated',
            added: amount
        })

    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
}

module.exports = {getUserBalance, depositBalance}