const getCityCountry = require('./getCityCountry')

const {sendPromiseToClient, formatCountry, formatCity} = require('./homeController')
const {addCityToDB} = require('../../mysqlConnect')

const aboutCity = (req, res) => {
  const {city, country} = getCityCountry(req.query.cityName)
  const promise = addCityToDB(country, city)
    .then(cityСountry => {
      const cityCountryData = {
        city: formatCity(cityСountry.city),
        country: formatCountry(cityСountry.country)
      }

      return cityCountryData
    })
  sendPromiseToClient(res, promise)
}

 module.exports = aboutCity
