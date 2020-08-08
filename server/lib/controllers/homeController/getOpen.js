const {openGetCurrent, openGetForecast} = require('../interactors/openWeather')
const {sendPromiseToClient, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const getCityCountry = require('./getCityCountry')


const getOpen = (req, res) => {
  const promise = openGetCurrent(req.query.cityName)
    .then(data => {

      return openGetForecast(req.query.cityName)
        .then(forecast => {

          const {city, country} = getCityCountry(data.list[0].name)
          return addWeatherToDB(country, city, {

            temperature: +(data.list[0].main.temp.toFixed(1)),
            iconId: data.list[0].weather[0].icon,
            iconPhrase: data.list[0].weather[0].description,
            source: 'openWeather'

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
    .then(({country, city, weather, forecasts}) => {
      console.log({
        country: formatCountry(country),
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts)
      })
      return {
        country: formatCountry(country),
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts)
      }
    })
  sendPromiseToClient(res, promise)
}

module.exports = getOpen
