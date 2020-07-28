const fetch = require('node-fetch')
const OAuth = require('oauth')

const {apiKeyAccuWeather, apiKeyOpenWeather, language, consumerKeyYahoo, consumerSecretYahoo} = require('../config')
const {addWeatherToDB, takeHistoryWeatherRequests, getAboutCity} = require('../mysqlConnect')
const ServiceError = require('../ServiceError')

const getYahoo = (req, res) => {
  const yahooRequest = new OAuth.OAuth(
      null,
      null,
      consumerKeyYahoo,
      consumerSecretYahoo,
      '1.0',
      null,
      'HMAC-SHA1',
      null,
      {'X-Yahoo-App-Id': 'BHSaSz1y'} //header
  )

  const promise = new Promise((resolve, reject) => {
      yahooRequest.get(
        `https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${req.query.cityName},ca&format=json&u=c`,
        null,
        null,
        (err, data) => err ? reject(err) : resolve(data)  //3-d - result
      )
    })
    .then(JSON.parse)
    .then(data => {
      if (data.location.city == 'Ca') {
        throw new ServiceError('Cannot request weather from YahooWeather', 'UNKNOWN_ERROR')
      }
      // console.log('--------------YAHOO---------------')
      // console.log(data.location)
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
    .catch(err => {
      console.error(err.message)
      throw new ServiceError('Cannot request weather from YahooWeather', 'UNKNOWN_ERROR')
    })
  sendPromiseToClient(res, promise)
}

const getOpen = (req, res) => {
  const promise = fetch(`http://api.openweathermap.org/data/2.5/find?q=${req.query.cityName}&units=metric&type=like&APPID=${apiKeyOpenWeather}`)
    .then(resApi => resApi.json())
    .then(data => {
      // console.log('--------------OPEN---------------')
      // console.log(data.list[0])
      // console.log('--------------OPEN---------------')
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
    .catch(err => {
      console.error(err.message)
      throw new ServiceError('Cannot request weather from OpenWeather', 'UNKNOWN_ERROR')
    })
  sendPromiseToClient(res, promise)
}

const getAccu = (req, res) => {
  const promise = fetch(`https://apidev.accuweather.com/locations/v1/cities/search.json?q=${req.query.cityName}&apikey=${apiKeyAccuWeather}&language=${language}`)
    .then(resApi => resApi.json())
    .catch(err => {
      console.error(err.message)
      throw new ServiceError('Wrong city', 'WRONG_CITY')
    })
    .then(dataCity => {
      // console.log('--------------ACCU CITY---------------')
      // console.log(dataCity[0])
      // console.log('--------------ACCU CITY---------------')
      const cityKey = dataCity[0].Key
      return fetch(`http://apidev.accuweather.com/currentconditions/v1/${cityKey}.json?language=en&apikey=${apiKeyAccuWeather}`)
        .then(resApi => resApi.json())
        .then(data => {
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
    .catch((err) => {
      console.error(err.message)
      throw new ServiceError('Cannot request weather from AccuWeather.' + err.message, 'UNKNOWN_ERROR')
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
      console.warn(err.message)
      if (err instanceof ServiceError) {
        res
          .status(400)
          .send({
            ok: false,
            error: {message: err.message, code: err.code}
          })
      }
    })
}

module.exports = {getYahoo, getOpen, getAccu, showHistory, aboutCity}
