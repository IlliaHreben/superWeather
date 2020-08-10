const yahooGetCurrentForecast = require('../interactors/yahooWeather')
const {sendPromiseToClient, getCityCountry, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const ServiceError = require('../../ServiceError')

const getYahoo = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    return Promise.reject(new ServiceError('Data did not come from the client', 'NO_DATA_COME'))
  }

  const {city, country} = getCityCountry(req.query)

  const promise = yahooGetCurrentForecast(city.latitude, city.longitude)
    .then(({current_observation: {condition}, forecasts}) => {
      return addWeatherToDB(country, city, {
        temperature: condition.temperature,
        iconId: condition.code,
        iconPhrase: condition.text,
        source: 'yahooWeather'
      }, forecasts.map(day => {
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
