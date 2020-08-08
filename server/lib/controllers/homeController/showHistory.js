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
        console.log('____________________________________________________________________')
        console.log(data)
        console.log('____________________________________________________________________')

        const weatherByCity = groupBy(data, ({city}) => `${city.name}_${city.index}`)
        console.log('++++++++++++++++++++++++++++++++++++++++++++')
        console.log(weatherByCity)
        console.log('++++++++++++++++++++++++++++++++++++++++++++')
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
            city: randomCity.name,
            country: randomCountry.name,
            temperature: avgTemperature,
            iconId: randomWeather.iconId,
            iconPhrase: randomWeather.iconPhrase,
            updatedAt: randomWeather.updatedAt,
            weathers: formatedWeathers
          }
        })
        console.log('formatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistory')
        console.log(formatedHistory)
        console.log('formatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistoryformatedHistory')
        return formatedHistory
      })
  )
}

const getRandomInt = (max) => {
  return Math.round(Math.random() * (max - 1))
}

module.exports = showHistory
