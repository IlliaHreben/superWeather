const fetch = require('node-fetch')

const {apiKeyAccuWeather, apiKeyAccuWeather2, language} = require('../../config')
const ServiceError = require('../../ServiceError')

const accuGetCity = (lat, lon) => {
  return fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKeyAccuWeather}&q=${lat},${lon}&language=${language}`)
    .then(resApi => resApi.json())
    .then(data => {
      if (data.Code) {
        if (data.Code === 'Unauthorized') throw new Error (data.Message)
        throw new ServiceError ('You entered the wrong city name', 'WRONG_CITY_NAME')
      }
      return data
    })
}

const accuGetCurrent = cityKey => {
  return fetch(`https://apidev.accuweather.com/currentconditions/v1/${cityKey}.json?language=en&apikey=hoArfRosT1215&metric=true`)
    .then(resApi => resApi.json())
}

const accuGetForecast = cityKey => {
  return fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${apiKeyAccuWeather}&language=${language}&metric=true`)
    .then(resApi => resApi.json())
}

const accuGetHourly = cityKey => {
  return fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${cityKey}?apikey=${apiKeyAccuWeather2}&language=${language}&metric=true&details=true`)
    .then(resApi => resApi.json())
}


 module.exports = {accuGetCity, accuGetCurrent, accuGetForecast, accuGetHourly}
