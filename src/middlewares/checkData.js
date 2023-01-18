const checkData = (req, res, next) => {
    const { name, difficulty, duration, season } = req.body
    if(!name) return res.status(400).send({error: 'Missing name'})
    if(!/^[a-zA-Z ]*$/.test(name)) return res.status(400).send({error: 'Name should contain only letters'})
    if(difficulty < 1 || difficulty > 5) return res.status(400).send({error: 'Difficulty should be a number between 1 and 5'})
    if(duration < 1 || duration > 24) return res.status(400).send({error: 'Difficulty should be a number between 1 and 24'})
    if(!season) return res.status(400).send('Season is required')
    
    next();
}

module.exports = checkData;