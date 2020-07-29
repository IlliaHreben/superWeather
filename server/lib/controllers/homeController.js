const {addWeatherToDB, takeHistoryWeatherRequests, getAboutCity} = require('../mysqlConnect')
const openGetCurrent = require('./interactors/openWeather')
const yahooGetCurrent = require('./interactors/yahooWeather')
const {accuGetCity, accuGetCurrent} = require('./interactors/accuWeather')
const ServiceError = require('../ServiceError')

const getYahoo = (req, res) => {
  const promise = yahooGetCurrent(req.query.cityName)
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
      })
    })
    .then(({city, weather}) => {
      return {city: formatCity(city), weather: formatWeather(weather)}
    })
  sendPromiseToClient(res, promise)
}

const getOpen = (req, res) => {
  const promise = openGetCurrent(req.query.cityName)
    .then(data => {
      return addWeatherToDB({
        name: data.list[0].name,
        country: data.list[0].sys.country,
        latitude: data.list[0].coord.lat,
        longitude: data.list[0].coord.lon,
        source: 'openWeather'
      }, {
        temperature: data.list[0].main.temp
      })
    })
    .then(({city, weather}) => {
      return {city: formatCity(city), weather: formatWeather(weather)}
    })
  sendPromiseToClient(res, promise)
}

const getAccu = (req, res) => {
  const promise = accuGetCity(req.query.cityName)
    .then(dataCity => {
      console.log('--------------ACCU CITY---------------')
      console.log(dataCity)
      console.log('--------------ACCU CITY---------------')
      return accuGetCurrent(dataCity[0].Key)
        .then(data => {
          console.log('--------------ACCU WEATHER---------------')
          console.log(data)
          console.log('--------------ACCU WEATHER---------------')
          return addWeatherToDB({
            name: dataCity[0].EnglishName,
            country: dataCity[0].Country.EnglishName,
            latitude: dataCity[0].GeoPosition.Latitude,
            longitude: dataCity[0].GeoPosition.Longitude,
            source: 'accuWeather'
          }, {
            temperature: data[0].Temperature.Metric.Value
          })
        })
    })
    .then(({city, weather}) => {
      return {city: formatCity(city), weather: formatWeather(weather)}
    })
  sendPromiseToClient(res, promise)
}

const formatWeather = weather => {
  return {
    temperature: weather.temperature,
    createdAt: weather.createdAt
  }
}

const formatCity = city => {
  return {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    source: city.source,
    createdAt: city.createdAt
  }
}

const showHistory = (req, res) => {
  sendPromiseToClient(res,
    takeHistoryWeatherRequests(req.query.cityName)
      .then(data => data.map(formatWeather))
  )
}

const aboutCity = (req, res) => {
  sendPromiseToClient(res,
    getAboutCity(req.query.cityName)
      .then(cities => cities.map(formatCity))
  )
}

const sendPromiseToClient = (res, promise) => {
  promise
    .then(data => {
      res.send({
        ok: true,
        data
      })
    })
    .catch(err => {
      if (err instanceof ServiceError) {
        console.warn(err.message)
        res
          .status(400)
          .send({
            ok: false,
            error: {message: err.message, code: err.code}
          })
      } else {
        console.error(err)
        res
          .status(500)
          .send({
            ok: false,
            error: {message: 'Unknown error', code: 'UNKNOWN_ERROR'}
          })
      }
    })
}

// fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBlZzpcj22jqN3A4IpBzygaB1XmlVGA3zM')
//   .then(res => {
//     console.log(res)
//   })

module.exports = {getYahoo, getOpen, getAccu, showHistory, aboutCity}
