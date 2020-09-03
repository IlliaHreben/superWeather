const fetch = require('node-fetch')

const {waqiApiKey} = require('../../config')

const getWaqi = async (lat, lon) => {
  const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiApiKey}`)

  return response.json()
}

 module.exports = {getWaqi}
