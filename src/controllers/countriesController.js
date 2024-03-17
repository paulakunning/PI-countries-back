const axios = require('axios')
const { Country, Activity } = require('../db.js')
const API_URL = 'https://restcountries.com/v3/all'


const getApiInfo = async () => {
    try {
        const request = await axios.get(API_URL);
        const countriesData = request.data.map(c => ({
            id: c.cca3,
            name: c.name.common,
            flag: c.flags[1],
            capital: c.capital ? c.capital[0] : "The country does not have a capital city",
            continent: c.continents[0],
            subregion: c.subregion ? c.subregion : "",
            area: c.area,
            population: c.population
        }));

        // Verificar si los países ya existen en la base de datos
        const existingCountries = await Country.findAll({
            where: {
                id: countriesData.map(c => c.id)
            }
        });

        // Filtrar los datos de los países para evitar duplicados
        const newCountriesData = countriesData.filter(c => !existingCountries.some(ec => ec.id === c.id));

        // Insertar los países que no existen en la base de datos
        if (newCountriesData.length > 0) {
            await Country.bulkCreate(newCountriesData);
        }

        const allCountries = await Country.findAll({
            include: [Activity]
        });
        
         // Ordenar los países por nombre
         const sortedCountries = allCountries.sort((a, b) => a.name.localeCompare(b.name));

         return sortedCountries;

    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};


/* const getApiInfo = async () => {
    const request = await axios.get(API_URL)
    const countries = request.data.forEach(c => {
        Country.findOrCreate({
            where: {
                id: c.cca3,
                name:c.name.common,
                flag:c.flags[1],
                capital: c.capital ? c.capital[0] : "The country does not have a capital city",
                continent: c.continents[0], 
                subregion: c.subregion ? c.subregion : "",
                area: c.area,
                population: c.population
            }
        })
    })

    const allCountries = await Country.findAll({
        include: [Activity]
    })
    return allCountries
}
 */
module.exports = {
    getApiInfo
}