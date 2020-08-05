const {openGetCurrent, openGetForecast} = require('../interactors/openWeather')
const {sendPromiseToClient, formatWeather, formatCity, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')

const countryCodes = require('country-codes-list')
const countryNames = countryCodes.customList('countryCode', '{countryNameEn}')


const getOpen = (req, res) => {
  const promise = openGetCurrent(req.query.cityName)
    .then(data => {
      // console.log(data.list[0].weather)
      return openGetForecast(req.query.cityName)
        .then(forecast => {
          // console.log(forecast.daily)
          return addWeatherToDB({
            name: data.list[0].name,
            country: countryNames[data.list[0].sys.country],
            latitude: data.list[0].coord.lat,
            longitude: data.list[0].coord.lon,
            source: 'openWeather'
          }, {
            temperature: +(data.list[0].main.temp.toFixed(1)),
            iconId: data.list[0].weather[0].icon,
            iconPhrase: data.list[0].weather[0].description
          }, forecast.daily.map(day => {
            return {
              date: new Date(+(day.dt + '000')),
              temperatureMin: +(day.temp.min.toFixed(1)),
              temperatureMax: +(day.temp.max.toFixed(1)),
              iconId: day.weather[0].icon,
              iconPhrase: day.weather[0].description
            }
          }))
        })
    })
    .then(({city, weather, forecasts}) => {
      return {
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts)
      }
    })
  sendPromiseToClient(res, promise)
}

module.exports = getOpen