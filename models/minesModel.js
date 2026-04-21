const db = require('../db/db.js')

async function createGame(userId, bombs, grid, revealed, betAmount) {
    const sql = `
        INSERT INTO mines_game 
        (UserID, Bombs, Grid, Revealed, BetAmount, Profit, Status)
        VALUES (?, ?, ?, ?, ?, 0, 'playing')
    `

    const [result] = await db.query(sql, [
        userId,
        bombs,
        JSON.stringify(grid),
        JSON.stringify(revealed),
        betAmount
    ])

    return { insertId: result.insertId }
}

async function getGameById(gameId) {
    const sql = 'SELECT * FROM mines_game WHERE GameID=?'
    const [result] = await db.query(sql, [gameId])
    return result[0]
}

async function updateGame(gameId, revealed, status, profit) {
    const sql = `
        UPDATE mines_game
        SET Revealed=?, Status=?, Profit=?
        WHERE GameID=?
    `

    const [result] = await db.query(sql, [
        JSON.stringify(revealed),
        status,
        profit,
        gameId
    ])

    return result
}

module.exports = {
    createGame,
    getGameById,
    updateGame
}