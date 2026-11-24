const axios = require('axios')
const { Country, Activity } = require('../db.js')
const API_URL = 'https://api.restcountries.com/countries/v5'

// El plan gratis devuelve como máximo 100 países por página, así que pedimos de a 100
const fetchAllCountries = async () => {
    const countries = [];
    let offset = 0;
    let more = true;
    while (more) {
        const { data } = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${process.env.COUNTRIES_API_KEY}` },
            params: { limit: 100, offset }
        });
        countries.push(...data.data.objects);
        more = data.data.meta.more;
        offset += 100;
    }
    return countries;
};

const getApiInfo = async () => {
    try {
        // Solo llamamos a la API la primera vez, cuando la base está vacía
        if (await Country.count() === 0) {
            const apiCountries = await fetchAllCountries();
            await Country.bulkCreate(apiCountries.map(c => ({
                id: c.codes.alpha_3,
                name: c.names.common,
                flag: c.flag.url_png,
                capital: c.capitals?.[0]?.name || "The country does not have a capital city",
                continent: c.continents[0],
                subregion: c.subregion || "",
                area: c.area?.kilometers,
                population: c.population
            })));
        }

        const allCountries = await Country.findAll({ include: [Activity] });
        return allCountries.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

module.exports = {
    getApiInfo
}