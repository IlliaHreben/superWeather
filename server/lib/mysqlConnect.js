const {Cities, Weathers, Forecasts} = require('./mysqlSchemes')


const addWeatherToDB = (cityData, weatherData, forecastData) => {
  return Cities.upsert(cityData)
    .then(([city]) => {
      return Weathers.create({
        ...weatherData,
        cityId: city.id
      })
        .then(weather => {

          return Forecasts.bulkCreate(forecastData.map(forecast => {
            forecast.cityId = city.id
            forecast.weatherId = weather.id
            return forecast
          }))
            .then(forecast => {
              console.log(`Sucessfuly added.`)
              return {city, weather, forecast}
            })
        })
    })
}

const takeHistoryWeatherRequests = name => {
  return Weathers.findAll({include: {
    model: Cities,
    where: {name}
  }})
}

const getAboutCity = name => {
  return Cities.findAll({
    where: {name},
    raw: true
  })
}

module.exports = {addWeatherToDB, takeHistoryWeatherRequests, getAboutCity}
