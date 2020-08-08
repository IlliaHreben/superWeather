const {accuGetCity, accuGetCurrent, accuGetForecast} = require('../interactors/accuWeather')
const {sendPromiseToClient, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const getCityCountry = require('./getCityCountry')

const getAccu = (req, res) => {
  const promise = accuGetCity(req.query.cityName)
    .then(dataCity => {
      return accuGetCurrent(dataCity[0].Key)
        .then(data => {
          return accuGetForecast(dataCity[0].Key)
            .then(forecast => {
              const {city, country} = getCityCountry(dataCity[0].EnglishName)
              return addWeatherToDB(country, city, {
                temperature: data[0].Temperature.Metric.Value,
                iconId: data[0].WeatherIcon,
                iconPhrase: data[0].WeatherText,
                source: 'accuWeather'
              }, forecast.DailyForecasts.map(day => {
                return {
                  date: day.Date,
                  temperatureMin: +((day.Temperature.Minimum.Value - 32) * 5/9).toFixed(1),
                  temperatureMax: +((day.Temperature.Maximum.Value - 32) * 5/9).toFixed(1),
                  iconId: day.Day.Icon.toString(),
                  iconPhrase: day.Day.IconPhrase
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
