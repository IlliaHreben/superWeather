const {openGetOneCall} = require('../interactors/openWeather')
const {sendPromiseToClient, getCityCountry, formatCountry, formatCity, formatWeather, formatForecasts, formatHourly} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const ServiceError = require('../../ServiceError')



const getOpen = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come to server', 'NO_DATA_COME'))
    )
    return
  }

  const {city, country} = getCityCountry(req.query)

  const promise = openGetOneCall(city.latitude, city.longitude)
    .then(({current, daily, hourly}) => {

      return addWeatherToDB(
        country,
        city,
        {
          temperature: +(current.temp.toFixed(1)),
          iconId: current.weather[0].icon,
          iconPhrase: current.weather[0].description,
          source: 'openWeather'
        },
        daily.map(({dt, temp, weather}) => {
          return {
            date: new Date(+(dt + '000')),
            temperatureMin: +(temp.min.toFixed(1)),
            temperatureMax: +(temp.max.toFixed(1)),
            iconId: weather[0].icon,
            iconPhrase: weather[0].description
          }
        })
      )
      .then(dbData => ({...dbData, hourly}) )
    })
    .then(({country, city, weather, forecasts, hourly}) => {
      return {
        country: formatCountry(country),
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts),
        hourly: hourly.map(hour => ({
          time: hour.dt,
          temperature: hour.temp,
          feelsLike: hour.feels_like,
          humidity: hour.humidity,
          dewPoint: hour.dew_point,
          clouds: hour.clouds,
          visibility: hour.visibility / 1000,
          wind: {
            speed: hour.wind_speed,
            deg: hour.wind_deg
          },
          iconId: hour.weather[0].icon,
          iconPhrase: hour.weather[0].icon
        }))
      }
    })
  sendPromiseToClient(res, promise)
}

module.exports = getOpen
