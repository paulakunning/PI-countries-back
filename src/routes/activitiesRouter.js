const express = require('express')
const { Country, Activity } = require('../db.js');
const checkData = require('../middlewares/checkData.js');

const activitiesRouter = express.Router();

activitiesRouter.get('/', async (req, res) => {
    try {
        const allActivities = await Activity.findAll({include: {
            model: Country,
            attributes: ['name'],
            through: {
                attributes:[]
            }
        }})
        res.send(allActivities)
    } catch (error) {
        res.status(400).send('Oops! There are not activities created yet.')
    }
})

activitiesRouter.post('/', checkData, async (req, res) => {
    const { name, difficulty, duration, season, countries } = req.body;
        try {
            const newActivity = await Activity.create({name, difficulty, duration, season})
            const countryActivity = await Country.findAll({
                where: { name: countries }
            })
            newActivity.addCountry(countryActivity)
            res.status(200).send('Activity created successfully')
        } catch (error) {
            res.status(400).send('Oops,something went wrong. Please try again')
        }
})

activitiesRouter.put('/:idAct', async (req, res) => {
    const {idAct} = req.params;
    const id = idAct.slice(1)
    try {
        const activity = await Activity.findByPk(id)
        if(!activity) return res.send('The id is invalid')
        
        const {name, difficulty, duration, season } = req.body;
        if(name) activity.name = name;
        if(difficulty) activity.difficulty = difficulty;
        if(duration) activity.duration = duration;
        if(season) activity.season = season;

        await activity.save()
        res.send(activity)

    } catch (error) {
        res.status(400).send(`Sorry, we can't edit the activity. Please try again`)
    }
})

activitiesRouter.delete('/:idAct', async(req, res) => {
    const { idAct } = req.params;
    const id = idAct.slice(1)
    try {
        const activity = await Activity.destroy({where: {id: id }})
        res.send('Activity deleted successfully')

    } catch (error) {
        res.status(400).send('Sorry, something went wrong. Please try again')
    }
})

module.exports = activitiesRouter