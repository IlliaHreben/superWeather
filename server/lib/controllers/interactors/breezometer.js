const fetch = require('node-fetch')

const {breezometerKey} = require('../../config')

const getBreezo = async (lat, lon) => {
  const response = await fetch(`https://api.breezometer.com/air-quality/v2/current-conditions?lat=${lat}&lon=${lon}&key=${breezometerKey}`)

  return response.json()
}

 module.exports = {getBreezo}
