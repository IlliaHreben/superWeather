const fetch = require('node-fetch')

const {apiKeyOpenWeather} = require('../../config')
const ServiceError = require('../../ServiceError')

const openGetCurrent = cityName => {
  return fetch(`http://api.openweathermap.org/data/2.5/find?q=${cityName}&units=metric&type=like&APPID=${apiKeyOpenWeather}`)
    .then(resApi => resApi.json())
    .then(data => {
      console.log('--------------OPEN---------------')
      console.log(data) // wrong city - { message: 'like', cod: '200', count: 0, list: [] }
      console.log('--------------OPEN---------------')
      if (!data.list[0]) {throw new ServiceError('You entered the wrong city name', 'WRONG_CITY_NAME')}
      return data
    })
}


 module.exports = openGetCurrent
