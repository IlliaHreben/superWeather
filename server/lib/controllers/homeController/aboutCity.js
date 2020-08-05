const countryData = require('country-codes-list').customList('countryNameEn', '{countryNameLocal},{countryCode},{region},{currencyCode},{officialLanguageCode},{officialLanguageNameEn},{officialLanguageNameLocal},+{countryCallingCode}')

const citiesBase = require('all-the-cities')


const {sendPromiseToClient, formatCity} = require('./homeController')
const {getAboutCity} = require('../../mysqlConnect')

const aboutCity = (req, res) => {
  sendPromiseToClient(res,
    getAboutCity(req.query.cityName)
      .then(cities => {
        const formatedCities = cities.map(formatCity)
        const [cityData] = citiesBase.filter(city => city.name.match(formatedCities[0].name)).sort((curr, next) => next.population - curr.population)
        const formatedCountryData = countryData[formatedCities[0].country].split(',')

        const cityCountryData = {
          city: {
            name: formatedCities[0].name,
            population: cityData.population,
            coordinates: cityData.loc.coordinates.join(', ')
          },
          country: {
            name: formatedCities[0].country,
            nameLocal: formatedCountryData[0],
            code: formatedCountryData[1],
            region: formatedCountryData[2],
            currencyCode: formatedCountryData[3],
            officialLanguageCode: formatedCountryData[4],
            officialLanguageNameEn: formatedCountryData[5],
            officialLanguageNameLocal: formatedCountryData[6],
            callingCode: formatedCountryData[7]
          }
        }
        // console.log(cityCountryData)

        return cityCountryData
      })
  )
}

 module.exports = aboutCity
