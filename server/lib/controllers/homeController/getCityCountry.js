const citiesBase = require('all-the-cities')
const countryData = require('country-codes-list').customList('countryCode', '{countryNameEn},{countryNameLocal},{countryCode},{region},{currencyCode},{officialLanguageNameEn},{officialLanguageNameLocal},+{countryCallingCode}')

function getCityCountry (cityName) {
  const [cityData] = citiesBase
    .filter(city => city.name.match(cityName))
    .sort((curr, next) => next.population - curr.population)

  const formatedCountryData = countryData[cityData.country].split(',')

  return {
    city: {
      index: cityData.cityId,
      name: cityData.name,
      population: +(cityData.population),
      latitude: cityData.loc.coordinates[0],
      longitude: cityData.loc.coordinates[1]
    },
    country: {
      name: formatedCountryData[0],
      nameLocal: formatedCountryData[1],
      code: formatedCountryData[2],
      region: formatedCountryData[3],
      currencyCode: formatedCountryData[4],
      languageName: formatedCountryData[5],
      languageNameLocal: formatedCountryData[6],
      callingCode: formatedCountryData[7]
    }
  }
}

module.exports = getCityCountry
