const {getWaqi} = require('../interactors/waqi')
const {sendPromiseToClient, getCityCountry} = require('./homeController')

const ServiceError = require('../../ServiceError')

const getWaqiPollution = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come to server', 'NO_DATA_COME'))
    )
    return
  }
  const getPollution = async () => {
    try {
      const {city} = getCityCountry(req.query)
      const pollution = await getWaqi(city.latitude, city.longitude)
      return formatPollution(pollution.data)
    }
    catch (err) {
      console.log(err)
    }
  }
  sendPromiseToClient(res, getPollution())

}

const formatPollution = pollution => {
  const {aqi, dominentpol} = pollution
  return {
    source: 'WAQI',
    aqi: `${aqi}/100`,
    mainPollutor: dominentpol
  }
}


module.exports = getWaqiPollution
