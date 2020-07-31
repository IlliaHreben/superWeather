const {accuGetCity, accuGetCurrent, accuGetForecast} = require('../interactors/accuWeather')
const {sendPromiseToClient, formatWeather, formatCity, formatForecasts} = require('./homeController')
const {addWeatherToDB} = require('../../mysqlConnect')

const getAccu = (req, res) => {
  const promise = accuGetCity(req.query.cityName)
    .then(dataCity => {
      // console.log('--------------ACCU CITY---------------')
      // console.log(dataCity)
      // console.log('--------------ACCU CITY---------------')


      return accuGetCurrent(dataCity[0].Key)
        .then(data => {
          return accuGetForecast(dataCity[0].Key)
            .then(forecast => {
              return addWeatherToDB({
                name: dataCity[0].EnglishName,
                country: dataCity[0].Country.EnglishName,
                latitude: dataCity[0].GeoPosition.Latitude,
                longitude: dataCity[0].GeoPosition.Longitude,
                source: 'accuWeather'
              }, {
                temperature: data[0].Temperature.Metric.Value
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
          // console.log('--------------ACCU WEATHER---------------')
          // console.log(data)
          // console.log('--------------ACCU WEATHER---------------')
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

module.exports = getAccu
