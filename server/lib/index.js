const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')

const getWaqiPollution = require('./controllers/homeController/getWaqi')
const getIQpollution = require('./controllers/homeController/getIQair')
const getYahoo = require('./controllers/homeController/getYahoo')
const getOpen = require('./controllers/homeController/getOpen')
const getAccu = require('./controllers/homeController/getAccu')
const showHistory = require('./controllers/homeController/showHistory')
const aboutCity = require('./controllers/homeController/aboutCity')
const getCitySentences = require('./controllers/homeController/getCitySentences')
const getCityInfoByCoords = require('./controllers/homeController/getCityInfoByCoords')
const getNews = require('./controllers/homeController/getNews')
const {port} = require('./config')

const api = express.Router()
  .get('/getGeolocation', getCityInfoByCoords)
  .get('/showhistory', showHistory)
  .get('/aboutCity', aboutCity)
  .get('/accu', getAccu)
  .get('/open', getOpen)
  .get('/yahoo', getYahoo)
  // .get('/ambee', getYahoo)
  .get('/iqair', getIQpollution)
  .get('/waqi', getWaqiPollution)
  .get('/searchSentence', getCitySentences)
  .get('/news', getNews)

const app = express()
  .use(serveStatic('../client/dist', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
