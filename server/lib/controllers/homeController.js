const fetch = require('node-fetch')
const OAuth = require('oauth')

const {apiKeyAccuWeather, apiKeyOpenWeather, language, consumerKeyYahoo, consumerSecretYahoo} = require('../config')
const {addDataToDB, takeHistoryWeatherRequests} = require('../mysqlConnect')
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
      return addDataToDB(req.query.cityName, data.current_observation.condition.temperature, 'yahooWeather')
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
      return addDataToDB(req.query.cityName, data.list[0].main.temp, 'openWeather')
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
      console.error(err)
      throw new ServiceError('Wrong city', 'WRONG_CITY')
    })
    .then(data => {
      const cityCode = data[0].Key
      return fetch(`http://apidev.accuweather.com/currentconditions/v1/${cityCode}.json?language=en&apikey=${apiKeyAccuWeather}`)
    })
    .then(resApi => resApi.json())
    .then(data => {
      return addDataToDB(req.query.cityName, data[0].Temperature.Metric.Value, 'accuWeather')
    })
    .catch(err => {
      console.error(err.message)
      throw new ServiceError('Cannot request weather from AccuWeather', 'UNKNOWN_ERROR')
    })
  sendPromiseToClient(res, promise)
}

const showHistory = (req, res) => {
  takeHistoryWeatherRequests(req.query.cityName)
    .then(data => {
      res.send({
        ok: true,
        data
      })
    })
}

const sendPromiseToClient = (res, promise) => {
  promise
    .then(data => {
      res.send({
        ok: true,
        data
      })
    })
    .catch(error => {
      console.warn(error)
      if (error instanceof ServiceError) {
        res
          .status(400)
          .send({
            ok: false,
            error: {message: error.message, code: error.code}
          })
      }
    })
}

module.exports = {getYahoo, getOpen, getAccu, showHistory}
