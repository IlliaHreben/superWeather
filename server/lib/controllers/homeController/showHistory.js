const {takeHistoryWeatherRequests} = require('../../mysqlConnect')
const {sendPromiseToClient, formatWeather} = require('./homeController')

const showHistory = (req, res) => {
  sendPromiseToClient(res,
    takeHistoryWeatherRequests(req.query.cityName)
      .then(data => data.map(formatWeather))
  )
}

module.exports = showHistory
