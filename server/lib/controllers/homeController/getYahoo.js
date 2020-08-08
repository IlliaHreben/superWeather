const yahooGetCurrentForecast = require('../interactors/yahooWeather')
const {sendPromiseToClient, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const getCityCountry = require('./getCityCountry')

const getYahoo = (req, res) => {
  const promise = yahooGetCurrentForecast(req.query.cityName)
    .then(data => {
      const {city, country} = getCityCountry(data.location.city)
      return addWeatherToDB(country, city, {
        temperature: data.current_observation.condition.temperature,
        iconId: data.current_observation.condition.code,
        iconPhrase: data.current_observation.condition.text,
        source: 'yahooWeather'
      }, data.forecasts.map(day => {
        return {
          date: +(day.date + '000'),
          temperatureMin: day.low,
          temperatureMax: day.high,
          iconId: day.code.toString(),
          iconPhrase: day.text
        }
      }))
    })
    .then(({country, city, weather, forecasts}) => {
      return {
        country: formatCountry(country),
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts)
      }
    })
  sendPromiseToClient(res, promise)
}

module.exports = getYahoo
