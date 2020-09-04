const {getBreezo} = require('../interactors/breezometer')
const {sendPromiseToClient, getCityCountry} = require('./homeController')

const ServiceError = require('../../ServiceError')

const getBreezoPollution = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come to server', 'NO_DATA_COME'))
    )
    return
  }
  const getPollution = async () => {
    try {
      const {city} = getCityCountry(req.query)
      const pollution = await getBreezo(city.latitude, city.longitude)
      return formatPollution(pollution.data.indexes.baqi)
    }
    catch (err) {
      console.log(err)
    }
  }
  sendPromiseToClient(res, getPollution())

}

const formatPollution = pollution => {
  const {aqi, dominant_pollutant} = pollution
  return {
    source: 'BreezoMeter',
    aqi: `${aqi}/100`,
    mainPollutor: dominant_pollutant
  }
}


module.exports = getBreezoPollution
