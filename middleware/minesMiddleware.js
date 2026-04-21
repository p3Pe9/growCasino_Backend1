async function validateGame(req, res, next) {
    console.log(req);
    const { bombs, betAmount } = req.body

    if (bombs < 1 || bombs > 24) {
        return res.status(400).json({ msg: 'Invalid bombs (1-24)' })
    }

    if (betAmount <= 0) {
        return res.status(400).json({ msg: 'Invalid bet' })
    }

    next()
}

export default { validateGame }
