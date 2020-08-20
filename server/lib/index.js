const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')

const getYahoo = require('./controllers/homeController/getYahoo')
const getOpen = require('./controllers/homeController/getOpen')
const getAccu = require('./controllers/homeController/getAccu')
const showHistory = require('./controllers/homeController/showHistory')
const aboutCity = require('./controllers/homeController/aboutCity')
const getCitySentences = require('./controllers/homeController/getCitySentences')
const getCityInfoByCoords = require('./controllers/homeController/getCityInfoByCoords')
const {port} = require('./config')

const api = express.Router()
  .get('/getGeolocation', getCityInfoByCoords)
  .get('/showhistory', showHistory)
  .get('/aboutCity', aboutCity)
  .get('/accu', getAccu)
  .get('/open', getOpen)
  .get('/yahoo', getYahoo)
  .get('/searchSentence', getCitySentences)

const app = express()
  .use(serveStatic('../client/dist', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
