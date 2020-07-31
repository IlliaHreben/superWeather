const ServiceError = require('../../ServiceError')

const formatWeather = weather => {
  return {
    temperature: weather.temperature,
    createdAt: weather.createdAt
  }
}

const formatCity = city => {
  return {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    source: city.source,
    createdAt: city.createdAt
  }
}


const sendPromiseToClient = (res, promise) => {
  promise
    .then(data => {
      res.send({
        ok: true,
        data
      })
    })
    .catch(err => {
      if (err instanceof ServiceError) {
        console.warn(err.message)
        res
          .status(400)
          .send({
            ok: false,
            error: {message: err.message, code: err.code}
          })
      } else {
        console.error(err)
        res
          .status(500)
          .send({
            ok: false,
            error: {message: 'Unknown error', code: 'UNKNOWN_ERROR'}
          })
      }
    })
}

// fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBlZzpcj22jqN3A4IpBzygaB1XmlVGA3zM')
//   .then(res => {
//     console.log(res)
//   })

module.exports = {sendPromiseToClient, formatWeather, formatCity}
