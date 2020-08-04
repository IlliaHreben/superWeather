const {Cities, Weathers, Forecasts} = require('./mysqlSchemes')


const addWeatherToDB = (cityData, weatherData, forecastData) => {
  return Cities.upsert(cityData)
    .then(([city]) => {
      return Weathers.upsert({
        ...weatherData,
        cityId: city.id
      })
        .then(([weather]) => {
          // console.log(weather)
          return Forecasts.bulkCreate(forecastData.map(forecast => {
            forecast.cityId = city.id
            forecast.weatherId = weather.id
            return forecast
          }))
            .then(forecasts => {
              console.log(`Sucessfuly added.`)
              return {city, weather, forecasts}
            })
        })
    })
}

const findCityWeatherRequests = () => {
  return Weathers.findAll({
    include: {
      model: Cities
    },
    order: [
      ['updatedAt', 'DESC'],
      [Cities, 'name', 'ASC']
    ],
    limit: 9
  })
}

const getAboutCity = name => {
  return Cities.findAll({
    where: {name}
  })
}

module.exports = {addWeatherToDB, findCityWeatherRequests, getAboutCity}
