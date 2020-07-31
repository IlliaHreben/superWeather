const {openGetCurrent, openGetForecast} = require('../interactors/openWeather')
const {sendPromiseToClient, formatWeather, formatCity, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')

const getOpen = (req, res) => {
  const promise = openGetCurrent(req.query.cityName)
    .then(data => {
      return openGetForecast(req.query.cityName)
        .then(forecast => {
          // console.log(forecast.daily)
          return addWeatherToDB({
            name: data.list[0].name,
            country: data.list[0].sys.country,
            latitude: data.list[0].coord.lat,
            longitude: data.list[0].coord.lon,
            source: 'openWeather'
          }, {
            temperature: data.list[0].main.temp
          }, forecast.daily.map(day => {
            return {
              date: new Date(+(day.dt + '000')),
              temperatureMin: day.temp.min,
              temperatureMax: day.temp.max,
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
