const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')

const port = 3000
const apiKeyAccuWeather = 'hoArfRosT1215'
const apiKeyOpenWeather = '1aa104f66067dcf0b4baff605313f074'


const api = express.Router()
  .get('/accu', (req, res) => {
    fetch(`http://apidev.accuweather.com/currentconditions/v1/324505.json?language=en&apikey=${apiKeyAccuWeather}`)
      .then(resApi => resApi.json())
      .then(data => {
        res.send({
          ok: true,
          data
        })
    })
    .catch(err => {
      res.send({
        ok: false,
        message: 'Cannot request weather from AccuWeather'
      })
      console.log(err)
    })
  })
  .get('/open', (req, res) => {
    fetch(`http://api.openweathermap.org/data/2.5/find?q=Kyiv&type=like&APPID=${apiKeyOpenWeather}`)
      .then(resApi => resApi.json())
      .then(data => {
        console.log(data.list[0].main.temp)
        res.send({
          ok: true,
          data
        })
    })
  })




const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
