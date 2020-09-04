const fetch = require('node-fetch')

const {iqairKey} = require('../../config')

const getIQair = async (lat, lon) => {
  const response = await fetch(`http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${iqairKey}`)

  return response.json()
}

 module.exports = {getIQair}
