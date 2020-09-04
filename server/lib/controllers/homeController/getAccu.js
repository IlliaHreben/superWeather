const {accuGetCity, accuGetCurrent, accuGetForecast, accuGetHourly} = require('../interactors/accuWeather')
const {sendPromiseToClient, getCityCountry, formatCountry, formatCity, formatWeather, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')
const ServiceError = require('../../ServiceError')

const getAccu = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come to server', 'NO_DATA_COME'))
    )
    return
  }

  const {city, country} = getCityCountry(req.query)

  const promise = accuGetCity(city.latitude, city.longitude)
    .then(({Key: key}) => {
      return accuGetCurrent(key)
        .then(([current]) => {
          return accuGetForecast(key)
            .then(forecast => {
              return accuGetHourly(key)
                .then(hourly => {
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
                    .then(dbData => ({...dbData, hourly}))
                })
            })
        })
    })
    .then(({country, city, weather, forecasts, hourly}) => {
      return {
        country: formatCountry(country),
        city: formatCity(city),
        weather: formatWeather(weather),
        forecasts: formatForecasts(forecasts),
        hourly: hourly.map(hour => ({
          time: hour.EpochDateTime,
          temperature: hour.Temperature.Value,
          feelsLike: hour.RealFeelTemperature.Value,
          humidity: hour.RelativeHumidity,
          dewPoint: hour.DewPoint.Value,
          clouds: hour.CloudCover,
          visibility: hour.Visibility.Value,
          wind: {
            speed: hour.Wind.Speed.Value,
            deg: hour.Wind.Direction.Degrees
          },
          iconId: hour.WeatherIcon,
          iconPhrase: hour.IconPhrase
        }))
      }
    })
  sendPromiseToClient(res, promise)
}



module.exports = getAccu
