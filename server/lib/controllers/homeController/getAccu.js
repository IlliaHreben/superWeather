const {accuGetCity, accuGetCurrent, accuGetForecast} = require('../interactors/accuWeather')
const {sendPromiseToClient, getCityCountry, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const ServiceError = require('../../ServiceError')

const getAccu = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    return Promise.reject(new ServiceError('Data did not come from the client', 'NO_DATA_COME'))
  }

  const {city, country} = getCityCountry(req.query)

  const promise = accuGetCity(city.latitude, city.longitude)
    .then(({Key: key}) => {
      return accuGetCurrent(key)
        .then(([current]) => {
          return accuGetForecast(key)
            .then(forecast => {
              return addWeatherToDB(country, city, {
                temperature: current.Temperature.Metric.Value,
                iconId: current.WeatherIcon,
                iconPhrase: current.WeatherText.replace(' w/', '.'),
                source: 'accuWeather'
              }, forecast.DailyForecasts.map(day => {
                return {
                  date: day.Date,
                  temperatureMin: day.Temperature.Minimum.Value,
                  temperatureMax: day.Temperature.Maximum.Value,
                  iconId: day.Day.Icon.toString(),
                  iconPhrase: day.Day.IconPhrase.replace(' w/', '.')
                }
              }))
            })
        })
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



module.exports = getAccu
