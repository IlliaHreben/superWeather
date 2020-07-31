const {accuGetCity, accuGetCurrent, accuGetForecast} = require('../interactors/accuWeather')
const {sendPromiseToClient, formatWeather, formatCity} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')

const getAccu = (req, res) => {
  const promise = accuGetCity(req.query.cityName)
    .then(dataCity => {
      // console.log('--------------ACCU CITY---------------')
      // console.log(dataCity)
      // console.log('--------------ACCU CITY---------------')
      accuGetForecast(dataCity[0].Key)
      return accuGetCurrent(dataCity[0].Key)
        .then(data => {
          // console.log('--------------ACCU WEATHER---------------')
          // console.log(data)
          // console.log('--------------ACCU WEATHER---------------')
          return addWeatherToDB({
            name: dataCity[0].EnglishName,
            country: dataCity[0].Country.EnglishName,
            latitude: dataCity[0].GeoPosition.Latitude,
            longitude: dataCity[0].GeoPosition.Longitude,
            source: 'accuWeather'
          }, {
            temperature: data[0].Temperature.Metric.Value
          })
        })
    })
    .then(({city, weather}) => {
      return {city: formatCity(city), weather: formatWeather(weather)}
    })
  sendPromiseToClient(res, promise)
}

module.exports = getAccu
