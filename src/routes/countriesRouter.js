const { Router } = require('express');
const countriesRouter = Router();
const { Op } = require('sequelize');
const { getApiInfo } = require('../controllers/countriesController');
const { Country, Activity } = require('../db.js')

countriesRouter.get('/', async (req, res) => {
    const { name } = req.query
    try {
      const allCountries = await getApiInfo()
        if(name){
           let countryByName = await Country.findAll({
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
        })
        countryByName.length ? res.status(200).send(countryByName) : res.status(400).send('Oops, no hay pais con ese nombre')
        } else {
          // Get countries sorted by name by default
          const allCountriesSorted = allCountries.sort(function(a,b){
            if(a.name > b.name) return 1
            if(b.name > a.name) return -1
            return 0 })
          res.status(200).send(allCountriesSorted) 
        }
    } catch (error) {
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