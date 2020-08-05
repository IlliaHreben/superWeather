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
  for(let container of widgetContainer) {container.style.display = 'inline-grid'}
  const mainContainer = document.getElementsByClassName('mainContainer')
  for(let container of mainContainer) {
    container.style.backgroundColor = 'white'
    container.style.boxShadow = '-2px 2px 10px rgba(0,0,0,0.7)'
  }


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

  jsonToData(promiseGetHistory)
    .then(data => {
      console.log(data)
      const lastSearchesContainer = document.getElementById('lastSearchesContainer')
      data.forEach(city => lastSearchesContainer.appendChild(displayLastSearchesToUser(city)))
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

const displayLastSearchesToUser = (historyCitySearch) => {

  const lastSearchDivCity = document.createElement('div')
  lastSearchDivCity.className = 'lastSearchCity'

  const date = document.createTextNode(`Not today, ${new Date(historyCitySearch.updatedAt).getDate()}th`)
  const time = document.createTextNode(formatDate(historyCitySearch.updatedAt, 'time'))
  const temperature = document.createTextNode(`${historyCitySearch.temperature}\u00B0C`)
  const description = document.createTextNode(historyCitySearch.iconPhrase)
  const cityCountry = document.createTextNode(`${historyCitySearch.city}, ${historyCitySearch.country}`)

  const dateContainer = document.createElement('div')
  const timeContainer = document.createElement('div')
  const temperatureContainer = document.createElement('div')
  const descriptionContainer = document.createElement('div')
  const cityCountryContainer = document.createElement('div')

  dateContainer.id = 'dayName'
  timeContainer.id = 'timeHistorySearch'
  temperatureContainer.id = 'temperature'
  descriptionContainer.id = 'description'
  cityCountryContainer.id = 'cityCountry'

  dateContainer.appendChild(date)
  timeContainer.appendChild(time)
  temperatureContainer.appendChild(temperature)
  descriptionContainer.appendChild(description)
  cityCountryContainer.appendChild(cityCountry)

  const lastSearchDivWidget = document.createElement('div')
  lastSearchDivWidget.className = 'lastSearchWidget'

  lastSearchDivWidget.appendChild(dateContainer)
  lastSearchDivWidget.appendChild(timeContainer)
  lastSearchDivWidget.appendChild(temperatureContainer)
  lastSearchDivWidget.appendChild(descriptionContainer)
  lastSearchDivWidget.appendChild(cityCountryContainer)

  lastSearchDivCity.appendChild(lastSearchDivWidget)

  const historySourcesWidgetsContainer = document.createElement('div')
  historySourcesWidgetsContainer.className = 'sourcesWidgetsContainer'


  historyCitySearch.weathers.forEach(weather => {
    const dateTime = document.createTextNode(formatDate(weather.updatedAt))
    const temperature = document.createTextNode(`${weather.temperature}\u00B0C`)
    const description = document.createTextNode(weather.iconPhrase)
    const source = document.createTextNode(weather.source)
    console.log(formatDate(weather.updatedAt))

    const dateTimeContainer = document.createElement('div')
    const temperatureContainer = document.createElement('div')
    const descriptionContainer = document.createElement('div')
    const sourceContainer = document.createElement('div')

    dateTimeContainer.id = 'dateTimeHistorySearch'
    temperatureContainer.id = 'temperature'
    descriptionContainer.id = 'description'
    sourceContainer.id = 'sourceHistorySearch'

    dateTimeContainer.appendChild(dateTime)
    temperatureContainer.appendChild(temperature)
    descriptionContainer.appendChild(description)
    sourceContainer.appendChild(source)

    const lastSearchDivWidget = document.createElement('div')
    lastSearchDivWidget.className = 'lastSearchWidget'

    lastSearchDivWidget.appendChild(dateTimeContainer)
    lastSearchDivWidget.appendChild(temperatureContainer)
    lastSearchDivWidget.appendChild(descriptionContainer)
    lastSearchDivWidget.appendChild(sourceContainer)

    historySourcesWidgetsContainer.appendChild(lastSearchDivWidget)
  })

  lastSearchDivCity.appendChild(historySourcesWidgetsContainer)

  return lastSearchDivCity
}

function formatDate (dateStr, timeOrDate) {
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

  if (timeOrDate === 'time') {
    return formatedTime
  } else if (timeOrDate === 'date') {
    return formatedDate
  }
  return `${formatedTime}, ${formatedDate}`
}
