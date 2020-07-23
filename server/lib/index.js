const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')
const OAuth = require('oauth')
const {promisify} = require('util')

const {port, apiKeyAccuWeather, apiKeyOpenWeather, language, consumerKeyYahoo, consumerSecretYahoo} = require('./config')
const {addDataToDB, takeHistoryWeatherRequests} = require('./mysqlConnect')

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



const api = express.Router()
  .get('/showhistory', (req, res) => {
    takeHistoryWeatherRequests(req.query.cityName)
      .then(data => {
        res.send({
          ok: true,
          data
        })
      })
  })
  .get('/accu', (req, res) => {
    fetch(`https://apidev.accuweather.com/locations/v1/cities/search.json?q=${req.query.cityName}&apikey=${apiKeyAccuWeather}&language=${language}`)
      .then(resApi => resApi.json())
      .catch(err => {
        console.error(err)
        throw new Error('Wrong city')
      })
      .then(data => {
        const cityCode = data[0].Key
        return fetch(`http://apidev.accuweather.com/currentconditions/v1/${cityCode}.json?language=en&apikey=${apiKeyAccuWeather}`)
      })
      .then(resApi => resApi.json())
      .then(data => {

        res.send({
          ok: true,
          data
        })

        addDataToDB(req.query.cityName, data[0].Temperature.Metric.Value, 'accuWeather')
      })
      .catch(err => {
        console.error(err)
        throw new Error('Cannot request weather from AccuWeather')
      })
      .catch(err => {
        console.error(err)
        res.send({
          ok: false,
          message: err.message
        })
      })
  })
  .get('/open', (req, res) => {
    fetch(`http://api.openweathermap.org/data/2.5/find?q=${req.query.cityName}&units=metric&type=like&APPID=${apiKeyOpenWeather}`)
      .then(resApi => resApi.json())
      .then(data => {
        res.send({
          ok: true,
          data
        })
        addDataToDB(req.query.cityName, data.list[0].main.temp, 'openWeather')
    })
  })
  .get('/yahoo', (req, res) => {
    const yahooResponse = new Promise((resolve, reject) => {
      yahooRequest.get(
        `https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${req.query.cityName},ca&format=json&u=c`,
        null,
        null,
        (err, data) => err ? reject(err) : resolve(data)  //3-d - result
      )
    })
    return yahooResponse
      .then(JSON.parse)
      .then(data => {
        res.send({
          ok: true,
          data
        })

        addDataToDB(req.query.cityName, data.current_observation.condition.temperature, 'yahooWeather')
      })
      .catch(err => {
        console.error(err)
        res.send({
          ok: false,
          message: err.message
        })
      })
  })




const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
