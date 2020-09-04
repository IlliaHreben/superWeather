const fetch = require('node-fetch')

const { openCageApiKey, language } = require('../../config')
const ServiceError = require('../../ServiceError')

const handleError = data => {
  const {code, message} = data.status
  if (code === 400) {
    throw new ServiceError('WHERE ARE U??????', 'INVALID_LOCATION')
  } else if (code !== 200) {
    throw new Error(message)
  }
}

const cityNameByCoords = (lat, lon) => {
  return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageApiKey}&no_annotations=1&language=${language}&pretty=1`)
    .then(resApi => resApi.json())
    .then(data => {
      handleError(data)
      return data
    })
}

 module.exports = {cityNameByCoords}
