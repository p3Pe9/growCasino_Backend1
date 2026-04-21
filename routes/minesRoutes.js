const express = require('express')
const router = express.Router()

const {
    startGame,
    revealTile,
    cashout
} = require('../controllers/minesController.js')

const { validateGame } = require('../middleware/minesMiddleware').default
const { authMiddleware } = require('../middleware/userMiddleware')


router.post('/start', authMiddleware, startGame)
router.post('/reveal', authMiddleware, revealTile)
router.post('/cashout', authMiddleware, cashout)

module.exports = router