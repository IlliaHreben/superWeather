const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')

const port = 3000
const apiKey = 'hoArfRosT1215'


const api = express.Router()
  .get('/accu', (req, res) => {
    fetch(`http://apidev.accuweather.com/currentconditions/v1/324505.json?language=en&apikey=${apiKey}`)
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


const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
