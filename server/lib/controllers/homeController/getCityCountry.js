const citiesBase = require('all-the-cities')
const countryData = require('country-codes-list').customList('countryCode', '{countryNameEn},{countryNameLocal},{countryCode},{region},{currencyCode},{officialLanguageNameEn},{officialLanguageNameLocal},{officialLanguageCode},+{countryCallingCode}')
const diacriticsRemove = require ('diacritics').remove
const ServiceError = require('../../ServiceError')
const {inRange} = require('lodash')

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

function getOneCityCountryByCoords (cityInfo) {
  const [cityData] = formatCityDataByCoords(cityInfo)

  return formatCityCountry(cityData)
}

function formatCityDataByCoords (cityData) {
  const middleSuitableСities = citiesBase
    .filter(city => {
      return  city.name.match(cityData.cityName) &&
              city.country.match(cityData.countryCode)
    })
    .sort((curr, next) => next.population - curr.population)

  const suitableСities = middleSuitableСities.filter(city => {
    return  inRange(city.loc.coordinates[1], +cityData.lat - 0.5, +cityData.lat + 0.5) &&
            inRange(city.loc.coordinates[0], +cityData.lon - 0.5, +cityData.lon + 0.5)
  })

  if (!suitableСities[0]) {
    throw new ServiceError('Cannot find city', 'CITY_NOT_FOUND')
  }
  return suitableСities
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
      languageCode: country[7],
      callingCode: country[8]
    }
  }
}


module.exports = {getCityCountryByName, getCityCountryByIndex, getOneCityCountryByName, getOneCityCountryByCoords}
