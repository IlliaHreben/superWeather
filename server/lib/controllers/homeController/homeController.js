const ServiceError = require('../../ServiceError')

const {getCityCountryByIndex, getOneCityCountryByName} = require('./getCityCountry')

const formatCountry = country => {
  return {
    name: country.name,
    nameLocal: country.nameLocal,
    code: country.code,
    region: country.region,
    currencyCode: country.currencyCode,
    languageName: country.languageName,
    languageNameLocal: country.languageNameLocal,
    callingCode: country.callingCode
  }
}

const formatCity = city => {
  return {
    name: city.name,
    index: city.index,
    population: city.population,
    latitude: city.latitude,
    longitude: city.longitude,
    createdAt: city.createdAt,
    updatedAt: city.updatedAt
  }
}

const formatWeather = weather => {
  return {
    temperature: weather.temperature,
    iconId: weather.iconId,
    iconPhrase: weather.iconPhrase,
    source: weather.source,
    createdAt: weather.createdAt,
    updatedAt: weather.updatedAt
  }
}


const formatForecasts = forecasts => {
  return forecasts.map(day => {
    return {
      date: day.date,
      temperatureMin: day.temperatureMin,
      temperature: day.temperatureMax,
      iconId: day.iconId,
      iconPhrase: day.iconPhrase
    }
  })
}

const getCityCountry = (query) => {
  if (query.index){
    return getCityCountryByIndex(query.index)
  } else if (query.cityName) {
    return getOneCityCountryByName(query.cityName)
  } else if (query.coordinates) {}
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

module.exports = {sendPromiseToClient, getCityCountry, formatCountry, formatCity, formatWeather, formatForecasts}
