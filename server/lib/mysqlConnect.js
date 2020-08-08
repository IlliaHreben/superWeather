const {Countries, Cities, Weathers, Forecasts} = require('./mysqlSchemes')


const addWeatherToDB = (countryData, cityData, weatherData, forecastData) => {
  return addCityToDB(countryData, cityData)
    .then(({country, city}) => {
      return Weathers.upsert({
        ...weatherData,
        cityId: city.id
      })
        .then(([weather]) => {
          return Forecasts.bulkCreate(forecastData.map(forecast => {
            forecast.cityId = city.id
            forecast.weatherId = weather.id
            return forecast
          }))
            .then(forecasts => {
              console.log(`Sucessfuly added.`)
              return {country, city, weather, forecasts}
            })
        })
    })
}



const addCityToDB = (countryData, cityData) => {
  return Countries.findOrCreate({
    where: { name: countryData.name},
    defaults: countryData
  })
    .then(([country]) => {
      return Cities.findOrCreate({
        where: { name: cityData.name},
        defaults: {
          ...cityData,
          countryId: country.id
        }
      })
        .then(([city]) => ({country, city}))
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
  return Cities.findOne({
    include: {
      model: Countries
    },
    where: {name}
  })
}

module.exports = {addWeatherToDB, findCityWeatherRequests, getAboutCity}
