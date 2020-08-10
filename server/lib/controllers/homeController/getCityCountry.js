const citiesBase = require('all-the-cities')
const countryData = require('country-codes-list').customList('countryCode', '{countryNameEn},{countryNameLocal},{countryCode},{region},{currencyCode},{officialLanguageNameEn},{officialLanguageNameLocal},+{countryCallingCode}')
const diacriticsRemove = require ('diacritics').remove
const ServiceError = require('../../ServiceError')

function getCityCountryByName (cityName) {
  const cityData = formatCityData(cityName).slice(0, 10)

  return cityData.map(formatCityCountry)
}

function getCityCountryByIndex (index) {
  const [cityData] = formatCityData(index)


  return formatCityCountry(cityData)
}

function getOneCityCountryByName (cityName) {
  const [cityData] = formatCityData(cityName)

  return formatCityCountry(cityData)
}

function formatCityData (desiredValue) {
  let cell
  if (!+desiredValue) {
    cell = 'name'
  } else if (+desiredValue) {
    cell = 'cityId'
  }

  const suitableСities = citiesBase
    .filter(city => city[cell].toString().match(desiredValue.toString()))
    .sort((curr, next) => next.population - curr.population)
    // console.log(suitableСities.slice(0,3))
  if (!suitableСities[0]) {
    throw new ServiceError('Cannot find city', 'CITY_NOT_FOUND')
  }
  return suitableСities
}

function formatCityCountry (city) {
  const country = countryData[city.country].split(',')

  return {
    city: {
      index: city.cityId,
      name: diacriticsRemove(city.name),
      population: +(city.population),
      latitude: city.loc.coordinates[1],
      longitude: city.loc.coordinates[0]
    },
    country: {
      name: diacriticsRemove(country[0]),
      nameLocal: country[1],
      code: country[2],
      region: country[3],
      currencyCode: country[4],
      languageName: country[5],
      languageNameLocal: country[6],
      callingCode: country[7]
    }
  }
}


module.exports = {getCityCountryByName, getCityCountryByIndex, getOneCityCountryByName}
