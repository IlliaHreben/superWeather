document.getElementById('search').onclick = () => {
  const cityName = document.getElementById('cityName').value
  if (!cityName || cityName === '') {
    console.log(`You did not enter the city name.`)
    return
  }

  const promiseYahoo = window.fetch(`/api/yahoo?cityName=${cityName}`)
  const promiseOpen = window.fetch(`/api/open?cityName=${cityName}`)
  const promiseAccu = window.fetch(`/api/accu?cityName=${cityName}`)
  const promiseGetHistory = window.fetch(`/api/showhistory?cityName=${cityName}`)

  const widgetContainer = document.getElementsByClassName('widgetContainer')
  console.log(widgetContainer)
  for(let container of widgetContainer) {container.style.display = 'inline-grid'}

  jsonToData(promiseGetHistory)
    .then(data => {
      data.forEach(row => {
        displayTempToUser(row, 'weatherHistory', 'weatherWidget')
      })
    })

  jsonToData(promiseAccu)
    .then(data => {
      displayTempToUser(data, data.city.source.toLowerCase(), 'weatherWidget')
      displayForecastToUser(data,'forecastWidget')
    })

  jsonToData(promiseOpen)
    .then(data => {
      displayTempToUser(data, data.city.source.toLowerCase(), 'weatherWidget')
      displayForecastToUser(data,'forecastWidget')
    })

  jsonToData(promiseYahoo)
    .then(data => {
      displayTempToUser(data, data.city.source.toLowerCase(), 'weatherWidget')
      displayForecastToUser(data,'forecastWidget')
    })
}

document.getElementById('about').onclick = () => {
  const cityName = document.getElementById('cityName').value
  if (!cityName || cityName === '') {
    console.log(`You did not enter the city name.`)
    return
  }

  const promiseAboutCity = window.fetch(`/api/aboutCity?cityName=${cityName}`)

  jsonToData(promiseAboutCity)
    .then(data => {
      const aboutCityArea = document.getElementById('aboutCityArea')
      data.forEach(raw => {
        const inputAboutCity = document.createElement('textarea')
        inputAboutCity.value = `${raw.name}, ${raw.country}. \rCoordinates: ${raw.latitude}, ${raw.longitude}. \rSource: ${raw.source} \rCreatedAt: ${formatDate(raw.createdAt)}`
        inputAboutCity.style.width = '100%'
        inputAboutCity.style.height = '70px'
        aboutCityArea.appendChild(inputAboutCity)
      })
    })
}

const jsonToData = (promise) => {
  return promise
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .catch(err => {
      displayTempToUser(`Error: ${err.message}. Code: ${err.code}`, 'error', 'errorMessage')
    })
}

function displayTempToUser (data, divTempId, divClassName) {
  const weatherDiv = document.createElement('div')
  weatherDiv.className = divClassName

  const dayNameContainer = document.createElement('div')
  const cityCountryContainer = document.createElement('div')
  const temperatureContainer = document.createElement('div')
  const descriptionContainer = document.createElement('div')
  const sourceContainer = document.createElement('div')

  dayNameContainer.id = 'dayName'
  cityCountryContainer.id = 'cityCountry'
  temperatureContainer.id = 'temperature'
  descriptionContainer.id = 'description'
  sourceContainer.id = 'source'

  const dayName = document.createTextNode('Today')
  const cityCountry = document.createTextNode(`${data.city.name}, ${data.city.country}`)
  const temperature = document.createTextNode(`${data.weather.temperature}\u00B0C`)
  const description = document.createTextNode(data.weather.iconPhrase)
  const source = document.createTextNode(data.city.source)

  dayNameContainer.appendChild(dayName)
  cityCountryContainer.appendChild(cityCountry)
  temperatureContainer.appendChild(temperature)
  descriptionContainer.appendChild(description)
  sourceContainer.appendChild(source)


  const divDisplayWeather = document.getElementById(divTempId)
  divDisplayWeather.style.display = 'inline-block'
  divDisplayWeather.style.visibility = 'visible'
  divDisplayWeather.style.opacity = '1'

  weatherDiv.appendChild(dayNameContainer)
  weatherDiv.appendChild(cityCountryContainer)
  weatherDiv.appendChild(temperatureContainer)
  weatherDiv.appendChild(descriptionContainer)
  weatherDiv.appendChild(sourceContainer)
  divDisplayWeather.appendChild(weatherDiv)
}

const displayForecastToUser = (data, divClassName) => {
  const forecastsDiv = document.createElement('div')
  forecastsDiv.className = 'forecastsContainer'
  const widgetsConatainer = document.getElementById(data.city.source + 'Container')

  data.forecasts.forEach(day => {
    const forecastDiv = document.createElement('div')
    forecastDiv.className = divClassName
    // forecastDiv.style.display = 'block'

    const dayNameContainer = document.createElement('div')
    const temperatureContainer = document.createElement('div')
    const temperatureMinContainer = document.createElement('div')
    const descriptionContainer = document.createElement('div')
    const sourceContainer = document.createElement('div')

    dayNameContainer.id = 'dayNameForecast'
    temperatureContainer.id = 'temperatureForecast'
    temperatureMinContainer.id = 'temperatureMinForecast'
    descriptionContainer.id = 'descriptionForecast'
    sourceContainer.id = 'sourceForecast'

    const dayName = document.createTextNode(`Not today, ${new Date(day.date).getDate()}th`)
    const temperature = document.createTextNode(`${day.temperatureMax}\u00B0C`)
    const temperatureMin = document.createTextNode(`${day.temperatureMin}\u00B0C`)
    const description = document.createTextNode(day.iconPhrase)
    const source = document.createTextNode(data.city.source)

    dayNameContainer.appendChild(dayName)
    temperatureContainer.appendChild(temperature)
    temperatureMinContainer.appendChild(temperatureMin)
    descriptionContainer.appendChild(description)
    sourceContainer.appendChild(source)


    forecastDiv.appendChild(dayNameContainer)
    forecastDiv.appendChild(temperatureContainer)
    forecastDiv.appendChild(temperatureMinContainer)
    forecastDiv.appendChild(descriptionContainer)
    forecastDiv.appendChild(sourceContainer)
    forecastsDiv.appendChild(forecastDiv)
  })
  widgetsConatainer.appendChild(forecastsDiv)
}

function formatDate (dateStr) {
  const dateObj = new Date(dateStr)

  const formatedTime = [
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds()
  ].join(':')

  const formatedDate = [
    dateObj.getDate(),
    dateObj.getMonth() + 1,
    dateObj.getFullYear()
  ].join('.')

  return `${formatedTime}, ${formatedDate}`
}
