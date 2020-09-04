const fetch = require('node-fetch')

const {apiKeyOpenWeather} = require('../../config')

const openGetOneCall = (lat, lon) => {
  return fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKeyOpenWeather}`)
    .then(resApi => resApi.json())
}

 module.exports = {openGetOneCall}
