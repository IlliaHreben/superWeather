const citiesBase = require('all-the-cities')
const countryData = require('country-codes-list').customList('countryCode', '{countryNameEn},{countryNameLocal},{countryCode},{region},{currencyCode},{officialLanguageNameEn},{officialLanguageNameLocal},+{countryCallingCode}')
const ServiceError = require('../../ServiceError')
const {sendPromiseToClient} = require('./homeController')

const getCitySentences = (req, res) => {
  const promise = new Promise((resolve, reject) => {
    const cities = getCityCountry(req.query.cityName)
    if (cities instanceof ServiceError) reject(cities)
    resolve(cities)
  })

  sendPromiseToClient(res, promise)
}

function getCityCountry (cityName) {
  const cityData = citiesBase
    .filter(city => city.name.match(cityName))
    .sort((curr, next) => next.population - curr.population)
    .slice(0, 10)

  if (!cityData) {
    return new ServiceError('Cannot find city', 'CITY_NOT_FOUND')
  }

  return cityData.map(city => {
    const formatedCountryData = countryData[city.country].split(',')

    return {
      cityName: city.name,
      countryName: formatedCountryData[0],
      population: +(city.population)
    }
  })
}

module.exports = getCitySentences
