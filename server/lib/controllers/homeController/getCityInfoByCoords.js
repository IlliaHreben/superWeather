const ServiceError = require('../../ServiceError')

const {cityNameByCoords} = require('../interactors/openCage')
const {getOneCityCountryByCoords} = require('./getCityCountry')
const {addCityToDB} = require('../../mysqlConnect')
const {sendPromiseToClient, formatCountry, formatCity} = require('./homeController')

const getCityInfoByCoords = (req, res) => {
  const {lat, lon} = req.query
  if (!lat || !lon) {
    return Promise.reject(new ServiceError('Data did not come from the client', 'NO_DATA_COME'))
  }

  const promise = cityNameByCoords(lat, lon)
    .then(({results}) => {
      return getOneCityCountryByCoords({
        cityName: results[0].components.city,
        countryCode: results[0].components.country_code.toUpperCase(),
        lat,
        lon
      })
    })
    .then(({country, city}) => addCityToDB(country, city))
    .then(cityСountry => ({
        city: formatCity(cityСountry.city),
        country: formatCountry(cityСountry.country)
    }) )

  sendPromiseToClient(res, promise)
}

module.exports = getCityInfoByCoords
