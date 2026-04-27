const {
    createGame,
    getGameById,
    updateGame
} = require('../models/minesModel')

const { updateBalance } = require('../models/userModel')

async function generateGrid(bombs) {
    const size = 25
    let grid = Array(size).fill('diamond')

    for (let i = 0; i < bombs; i++) {
        let index
        do {
            index = Math.floor(Math.random() * size)
        } while (grid[index] === 'bomb')

        grid[index] = 'bomb'
    }

    return grid
}

async function startGame(req, res) {
    try {
        const { bombs } = req.body
        const betAmount = Number(req.body.betAmount)

        const userId = req.user.UserID

        const user = await findUserById(userId)

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }

        if (Number(user.Balance) < betAmount) {
            return res.status(400).json({
                msg: 'Not enough balance'
            })
        }

        await updateBalance(userId, -betAmount)

        res.json({
            msg: 'Game started'
        })

    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
}

// kattintás
async function revealTile(req, res) {
    try {
        const { gameId, index } = req.body

        const game = await getGameById(gameId)
        if (!game) return res.status(404).json({ msg: 'Game not found' })

        let grid = JSON.parse(game.Grid)
        let revealed = JSON.parse(game.Revealed)

        if (revealed[index]) {
            return res.status(400).json({ msg: 'Already revealed' })
        }

        revealed[index] = true

        if (grid[index] === 'bomb') {
            await updateGame(gameId, revealed, 'lost', 0)

            return res.json({
                result: 'bomb',
                status: 'lost'
            })
        }

        let revealedCount = revealed.filter(r => r).length

        let multiplier = 1 + revealedCount * 0.2
        let profit = game.BetAmount * multiplier

        await updateGame(gameId, revealed, 'playing', profit)

        res.json({
            result: 'diamond',
            multiplier,
            profit
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function cashout(req, res) {
    try {
        const { gameId } = req.body
        const userId = req.user.UserID

        const game = await getGameById(gameId)

        if (game.Status !== 'playing') {
            return res.status(400).json({ msg: 'Game finished' })
        }

        await updateBalance(userId, game.Profit)

        await updateGame(
            gameId,
            JSON.parse(game.Revealed),
            'won',
            game.Profit
        )

        res.json({
            status: 'won',
            profit: game.Profit
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    startGame,
    revealTile,
    cashout
}