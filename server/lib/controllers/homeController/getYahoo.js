const yahooGetCurrentForecast = require('../interactors/yahooWeather')
const {sendPromiseToClient, formatWeather, formatCity} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')

const getYahoo = (req, res) => {
  const promise = yahooGetCurrentForecast(req.query.cityName)
    .then(data => {
      // console.log('--------------YAHOO---------------')
      // console.log(data)
      // console.log('--------------YAHOO---------------')

      return addWeatherToDB({
        name: data.location.city,
        country: data.location.country,
        latitude: data.location.lat,
        longitude: data.location.long,
        source: 'yahooWeather'
      }, {
        temperature: data.current_observation.condition.temperature
      }, data.forecasts.map(day => {
        return {
          date: day.date,
          temperatureMin: day.low,
          temperatureMax: day.high,
          iconId: day.code.toString(),
          iconPhrase: day.text
        }
      }))
    })
    .then(({city, weather}) => {
      return {city: formatCity(city), weather: formatWeather(weather)}
    })
  sendPromiseToClient(res, promise)
}

module.exports = getYahoo
