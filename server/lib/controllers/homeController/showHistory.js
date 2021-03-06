const {findCityWeatherRequests} = require('../../mysqlConnect')
const {sendPromiseToClient, formatWeather, formatCity} = require('./homeController')

function groupBy(list, getKey) {
  return list.reduce((acc, listElement) => {
    const key = getKey(listElement)

    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(listElement)
    return acc
  }, {})
}


const showHistory = (_, res) => {
  sendPromiseToClient(res,
    findCityWeatherRequests()
      .then(data => {

        const weatherByCity = groupBy(data, ({city}) => `${city.name}_${city.index}`)
        const formatedHistory =  Object.values(weatherByCity).map(weathers => {
          const randomWeatherSource = getRandomInt(weathers.length)
          const randomCity = weathers[randomWeatherSource].city
          const randomCountry = weathers[randomWeatherSource].country
          const randomWeather = weathers[randomWeatherSource]
          const avgTemperature = +(weathers
            .map(weather => weather.temperature)
            .reduce((acc, temperature) => acc + temperature / weathers.length, 0)
            .toFixed(1)
          )

          const formatedWeathers = weathers.map(weather => ({
            country: weather.country.name,
            city: weather.city.name,
            ...formatWeather(weather)
          }))

          return {
            city: randomCity,
            country: randomCountry,
            weather: {
              temperature: avgTemperature,
              iconId: randomWeather.iconId,
              iconPhrase: randomWeather.iconPhrase,
              updatedAt: randomWeather.updatedAt,
              backgroundSource: randomWeather.source
            },
            weathers: formatedWeathers,

          }
        })
        return formatedHistory
      })
  )
}

const getRandomInt = (max) => {
  return Math.round(Math.random() * (max - 1))
}

module.exports = showHistory
