const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')

const {getYahoo, getOpen, getAccu, showHistory, aboutCity} = require('./controllers/homeController')
const {port} = require('./config')

const api = express.Router()
  .get('/showhistory', showHistory)
  .get('/aboutCity', aboutCity)
  .get('/accu', getAccu)
  .get('/open', getOpen)
  .get('/yahoo', getYahoo)


const app = express()
  .use(serveStatic('../client/public', {extensions: ['html']}))
  .use(bodyParser.json())
  .use('/api', api)
  .listen(port)
