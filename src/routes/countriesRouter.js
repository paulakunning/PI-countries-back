const { Router } = require('express');
const countriesRouter = Router();
const { Op } = require('sequelize');
const { getApiInfo } = require('../controllers/countriesController');
const { Country, Activity } = require('../db.js')

countriesRouter.get('/', async (req, res) => {
    const { name } = req.query
    try {
      let countries;
        if(name){
          countries = await Country.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }, 
            include: {
              model: Activity,
              attributes: ['name', 'difficulty', 'duration', 'season'],
              through: {
                attributes:[]
            }
          }
        });
        if (countries.length === 0) {
          return res.status(400).send('Oops, no hay país con ese nombre');
          }
        } else {
          countries = await getApiInfo();
        }
        res.status(200).send(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(400).send('Oops! Something went wrong. Please try again')
    }    
})

countriesRouter.get('/:id', async (req, res) => { 
   const {id}  = req.params
   const countryId = id.slice(1).toUpperCase()

   if(!countryId) {return res.send('ID is required').status(400)}
   if (countryId && countryId.length === 3) {
    try {
      let countryById = await Country.findByPk(countryId, {
        include: {
          model: Activity,
          attributes: ['name', 'difficulty', 'duration', 'season'],
             through: {
               attributes:[]
           }
        },
      });
      return countryById ? res.send(countryById).status(200) : res.status(400).send('It does not exist a country with that id. Please try again')
    } catch (error) {
      return res.status(400).send('It does not exist a country with that id. Please try again');
    }
   } else {
    return res.status(400).send( 'It does not exist a country with that id. Please try again')
   }
})

module.exports = countriesRouter