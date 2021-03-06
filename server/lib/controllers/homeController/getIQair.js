const {getIQair} = require('../interactors/iqair')
const {sendPromiseToClient, getCityCountry} = require('./homeController')

const ServiceError = require('../../ServiceError')

const getIQpollution = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come to server', 'NO_DATA_COME'))
    )
    return
  }
  const getPollution = async () => {
    try {
      const {city} = getCityCountry(req.query)
      const pollution = await getIQair(city.latitude, city.longitude)
      return formatPollution(pollution.data)
    }
    catch (err) {
      console.log(err)
    }
  }
        sendPromiseToClient(res, getPollution())

}

const formatPollution = pollution => {
  const {current} = pollution
  return {
    source: 'IQ Air',
    aqi: `${current.pollution.aqius}/100`,
    mainPollutor: current.pollution.mainus
  }
}


module.exports = getIQpollution
