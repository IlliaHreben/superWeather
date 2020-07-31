const fetch = require('node-fetch')

const {apiKeyAccuWeather, language} = require('../../config')
const ServiceError = require('../../ServiceError')

const accuGetCity = cityName => {
  return fetch(`https://apidev.accuweather.com/locations/v1/cities/search.json?q=${cityName}&apikey=${apiKeyAccuWeather}&language=${language}`)
    .then(resApi => resApi.json())
    .then(data => {
      if (!data[0]) {
        throw new ServiceError ('You entered the wrong city name', 'WRONG_CITY_NAME')
      }
      return data
    })
}

const accuGetCurrent = cityKey => {
  return fetch(`https://apidev.accuweather.com/currentconditions/v1/${cityKey}.json?language=en&apikey=${apiKeyAccuWeather}`)
    .then(resApi => resApi.json())
}

const accuGetForecast = cityKey => {
  return fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=8fcGrl6GYczUPQOshCeWIxss6guDWoKl&language=en-us`)
    .then(resApi => resApi.json())
}

 module.exports = {accuGetCity, accuGetCurrent, accuGetForecast}
