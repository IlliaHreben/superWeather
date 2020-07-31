const {sendPromiseToClient, formatCity} = require('./homeController')
const {getAboutCity} = require('../../mysqlConnect')

const aboutCity = (req, res) => {
  sendPromiseToClient(res,
    getAboutCity(req.query.cityName)
      .then(cities => cities.map(formatCity))
  )
}

 module.exports = aboutCity
