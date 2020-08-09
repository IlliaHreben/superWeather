// const geo = navigator.geolocation.getCurrentPosition()
// console.log(geo)
import moment from 'moment'
import './styles.css'
import '@openfonts/roboto_cyrillic'

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
      console.log(data)
      displayTempToUser(data, data.weather.source.toLowerCase(), 'weatherWidget')
      displayForecastToUser(data,'forecastWidget')
    })

  jsonToData(promiseOpen)
    .then(data => {
      displayTempToUser(data, data.weather.source.toLowerCase(), 'weatherWidget')
      displayForecastToUser(data,'forecastWidget')
    })

  jsonToData(promiseYahoo)
    .then(data => {
      displayTempToUser(data, data.weather.source.toLowerCase(), 'weatherWidget')
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
    .then(({country, city}) => {
      const cityNameContainer = document.getElementById('cityNameContainer')
      const aboutContainer = document.createElement('div')
      aboutContainer.className = 'aboutContainer'
      aboutContainer.id = 'aboutCityArea'
      cityNameContainer.appendChild(aboutContainer)
      const infoContainer = document.createElement('div')
      infoContainer.className = 'infoContainer'
      infoContainer.id = 'infoContainer'
      console.log(city, country)
      const heading             = createP('headingName', 'nameCountry',        `${city.name}, ${country.name} (${country.nameLocal})`, 'H1')
      createDivText(infoContainer, 'headingContainer', [heading])

      const iconPopulation      = createI('fas fa-users fa-lg')
      const populationHeading   = createP('headingFat',  'populationHeading',  'Population: ')
      const populationText      = createP('infoText',    'populationText',     `${city.population} peoples.`)
      createDivText(infoContainer, 'stringInfoContainer', [iconPopulation, populationHeading, populationText])

      const iconRegion          = createI('fas fa-globe fa-lg')
      const regionHeading       = createP('headingFat',  'regionHeading',      'Region: ')
      const regionText          = createP('infoText',    'regionText',         `${country.region}.`)
      createDivText(infoContainer, 'stringInfoContainer', [iconRegion, regionHeading, regionText])

      const iconCoordinates     = createI('fas fa-map-marked-alt fa-lg')
      const coordinatesHeading  = createP('headingFat',  'coordinatesHeading', 'Coordinates: ')
      const coordinatesText     = createP('infoText',    'coordinatesText',    `${city.latitude}, ${city.longitude}.`)
      createDivText(infoContainer, 'stringInfoContainer', [iconCoordinates, coordinatesHeading, coordinatesText])

      const iconCurrency        = createI('fas fa-wallet fa-lg')
      const currencyHeading     = createP('headingFat',  'currencyHeading',    'Currency code: ')
      const currencyText        = createP('infoText',    'currencyText',       `${country.currencyCode}.`)
      createDivText(infoContainer, 'stringInfoContainer', [iconCurrency, currencyHeading, currencyText])

      const iconCallingCode     = createI('fas fa-phone fa-lg')
      const callingCodeHeading  = createP('headingFat',  'callingCodeHeading', 'Country calling code: ')
      const callingCodeText     = createP('infoText',    'callingCodeText',    `${country.callingCode}.`)
      createDivText(infoContainer, 'stringInfoContainer', [iconCallingCode, callingCodeHeading, callingCodeText])

      const iconLanguage        = createI('fas fa-language fa-lg')
      const languageHeading     = createP('headingFat',  'languageHeading',    'Official language: ')
      const languageText        = createP('infoText',    'languageText',       `${country.languageName} (${country.languageNameLocal}).`)
      createDivText(infoContainer, 'stringInfoContainer', [iconLanguage, languageHeading, languageText])

      const closeButton         = createI('fas fa-times fa-lg', )
      createDivText(infoContainer, 'closeButtonContainer', [closeButton], 'closeinfoButton')

      aboutContainer.appendChild(infoContainer)

      document.getElementById('closeinfoButton').onclick = () => {
        document.getElementById('aboutCityArea').remove()
      }
    })
}



function createDivText (parent, className, children, id) {
  const div = document.createElement('div')
  div.className = className
  children.forEach(child => div.appendChild(child))
  if (id) {
    div.id = id
  }
  parent.appendChild(div)
}

function createI (className, id) {
  const i = document.createElement('I')
  i.className = className
  if (id) {
    i.id = id
  }

  return i
}

function createP (className, id, text, type) {
  if (!type) {
    type = 'P'
  }
  const p = document.createElement(type)
  p.className = className
  p.id = id
  p.innerText = text
  return p
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
      console.log(err)
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
  const cityCountry = document.createTextNode(`${data.city.name}, ${data.country.name}`)
  const temperature = document.createTextNode(`${data.weather.temperature}\u00B0C`)
  const description = document.createTextNode(`${data.weather.iconPhrase}.`)
  const source = document.createTextNode(data.weather.source)

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
  const widgetsConatainer = document.getElementById(data.weather.source + 'Container')

  data.forecasts.forEach(day => {
    const forecastDiv = document.createElement('div')
    forecastDiv.className = divClassName

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

    const dayName = document.createTextNode(moment(day.date).format('dddd, Do'))
    const temperature = document.createTextNode(`${day.temperatureMax}\u00B0C`)
    const temperatureMin = document.createTextNode(`${day.temperatureMin}\u00B0C`)
    const description = document.createTextNode(`${day.iconPhrase}.`)
    const source = document.createTextNode(data.weather.source)

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

  const momentDate = moment(historyCitySearch.updatedAt)
  const date = document.createTextNode(momentDate.format('dddd, Do'))
  const time = document.createTextNode(momentDate.format('HH:mm a'))
  const temperature = document.createTextNode(`${historyCitySearch.temperature}\u00B0C`)
  const description = document.createTextNode(`${historyCitySearch.iconPhrase}.`)
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

    const dateTime = document.createTextNode(moment(weather.updatedAt).format('ddd, Do MMM, h:mm a'))
    const temperature = document.createTextNode(`${weather.temperature}\u00B0C`)
    const description = document.createTextNode(`${weather.iconPhrase}.`)
    const source = document.createTextNode(weather.source)

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
