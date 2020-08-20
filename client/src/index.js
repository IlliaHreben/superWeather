// const geo = navigator.geolocation.getCurrentPosition()
import moment from 'moment'
import {debounce} from 'lodash'
import './styles.css'
import '@openfonts/roboto_cyrillic'

// function importAll(r) {
//   let images = {}
//   r.keys().map(item => { images[item.replace('./', '').replace('.png', '')] = r(item).default })
//   return images
// }
//
// const widgetBackgrounds = importAll(require.context('./pictures/widgetPics', true, /\.(png|jpe?g|svg)$/));
//
// function capitalizer(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }

// document.getElementById('cityName').oninput = (event) => {
//   document.getElementById('loadingIcon').style.opacity = '1'
//
//   debouncer(event)
// }
//
// const debouncer = debounce((event) => {
//   onKeyupSearchCity(event.target.value)
//     .then(() => {
//       document.getElementById('loadingIcon').style.opacity = '0'
//     })
// }, 600)
//
// const onKeyupSearchCity = (cityName) => {
//   const citySentencesContainer = document.getElementById('citySentences')
//   citySentencesContainer.innerHTML = ''
//   citySentencesContainer.style.height = 'auto'
//   citySentencesContainer.style.visibility = 'visible'
//   citySentencesContainer.style.opacity = '1'
//
//   if (!cityName || cityName === '') {
//     console.log(`You did not enter the city name.`)
//     citySentencesContainer.style.height = '0'
//     citySentencesContainer.style.visibility = 'hidden'
//     citySentencesContainer.style.opacity = '0'
//     return Promise.resolve([])
//   }
//
//   const promiseSearchSentence = window.fetch(`/api/searchSentence?cityName=${cityName}`)
//
//   return jsonToData(promiseSearchSentence)
//     .then(citySentences => {
//
//       return citySentences.map(citySentence => ([citySentence.city.index, displayCitySentence(citySentence, citySentencesContainer)]))
//     })
    // .then(citySentenceDivs => {
      citySentenceDivs.forEach(citySentenceDiv => {
        citySentenceDiv[1].onclick = () => {
          citySentencesContainer.style.height = '0'
          citySentencesContainer.style.visibility = 'hidden'
          citySentencesContainer.style.opacity = '0'
          fetchWeatherForecastsHistory('index', citySentenceDiv[0])
        }
      })
    // })

// }
//
// const displayCitySentence = ({country, city}, parent) => {
//
//   const cityNameSentence = createP('cityNameSentence', `  ${city.name}, `)
//   const countryNameSentence = createP('countryNameSentence', country.name)
//   const populationSentence = createP('populationSentence', `${city.population} peoples`)
//
//   return createDivText(
//     parent,
//     'citySentenceContainer',
//     [cityNameSentence, countryNameSentence, populationSentence]
//   )
// }






const fetchWeatherForecastsHistory = (key, desiredValue) => {
  const promiseYahoo = window.fetch(`/api/yahoo?${key}=${desiredValue}`)
  const promiseOpen = window.fetch(`/api/open?${key}=${desiredValue}`)
  const promiseAccu = window.fetch(`/api/accu?${key}=${desiredValue}`)
  const promiseGetHistory = window.fetch(`/api/showhistory`)

  // displayHeaderToUser('Current condition for requested city', 'currentCondition')
  const widgetContainer = document.getElementsByClassName('widgetContainer')
  for(let container of widgetContainer) {container.style.display = 'inline-grid'}
  // const mainContainer = document.getElementsByClassName('mainContainer')
  // for(let container of mainContainer) {
  //   container.style.backgroundColor = 'white'
  //   container.style.boxShadow = '-2px 2px 10px rgba(0,0,0,0.7)'
  // }
  //
  //
  // jsonToData(promiseAccu)
  //   .then(data => {
  //     displayTempToUser(data)
  //     displayForecastToUser(data)
  //   })
  //
  // jsonToData(promiseOpen)
  //   .then(data => {
  //     displayTempToUser(data)
  //     displayForecastToUser(data)
  //   })
  //
  // jsonToData(promiseYahoo)
  //   .then(data => {
  //     displayTempToUser(data)
  //     displayForecastToUser(data)
  //   })

  jsonToData(promiseGetHistory)
    .then(data => {
      const lastSearchesContainer = document.getElementById('lastSearchesContainer')
      data.forEach(city => lastSearchesContainer.appendChild(displayLastSearchesToUser(city)))
    })
}

document.getElementById('search').onclick = () => {
  const cityName = document.getElementById('cityName').value
  if (!cityName || cityName === '') {
    console.log(`You did not enter the city name.`)
    return
  }

  fetchWeatherForecastsHistory('cityName', cityName)
}

// document.getElementById('about').onclick = () => {
//   const cityName = document.getElementById('cityName').value
//   if (!cityName || cityName === '') {
//     console.log(`You did not enter the city name.`)
//     return
//   }
//
//   const promiseAboutCity = window.fetch(`/api/aboutCity?cityName=${cityName}`)
//
//   jsonToData(promiseAboutCity)
//     .then(({country, city}) => {
//       const cityNameContainer = document.getElementById('cityNameContainer')
//       const aboutContainer = document.createElement('div')
//       aboutContainer.className = 'aboutContainer'
//       aboutContainer.id = 'aboutCityArea'
//       cityNameContainer.appendChild(aboutContainer)
//       const infoContainer = document.createElement('div')
//       infoContainer.className = 'infoContainer'
//       infoContainer.id = 'infoContainer'
//       const heading             = createP('headingName',        `${city.name}, ${country.name} (${country.nameLocal})`, 'nameCountry', 'H1')
//       createDivText(infoContainer, 'headingContainer', [heading])
//
//       const iconPopulation      = createI('fas fa-users fa-lg')
//       const populationHeading   = createP('headingFat',  'Population: ',  'populationHeading')
//       const populationText      = createP('infoText',     `${city.population} peoples.`,    'populationText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconPopulation, populationHeading, populationText])
//
//       const iconRegion          = createI('fas fa-globe fa-lg')
//       const regionHeading       = createP('headingFat',      'Region: ',  'regionHeading')
//       const regionText          = createP('infoText',         `${country.region}.`,    'regionText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconRegion, regionHeading, regionText])
//
//       const iconCoordinates     = createI('fas fa-map-marked-alt fa-lg')
//       const coordinatesHeading  = createP('headingFat', 'Coordinates: ',  'coordinatesHeading')
//       const coordinatesText     = createP('infoText',    `${city.latitude}, ${city.longitude}.`,    'coordinatesText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconCoordinates, coordinatesHeading, coordinatesText])
//
//       const iconCurrency        = createI('fas fa-wallet fa-lg')
//       const currencyHeading     = createP('headingFat',    'Currency code: ',  'currencyHeading')
//       const currencyText        = createP('infoText',       `${country.currencyCode}.`,    'currencyText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconCurrency, currencyHeading, currencyText])
//
//       const iconCallingCode     = createI('fas fa-phone fa-lg')
//       const callingCodeHeading  = createP('headingFat', 'Country calling code: ',  'callingCodeHeading')
//       const callingCodeText     = createP('infoText',    `${country.callingCode}.`,    'callingCodeText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconCallingCode, callingCodeHeading, callingCodeText])
//
//       const iconLanguage        = createI('fas fa-language fa-lg')
//       const languageHeading     = createP('headingFat',    'Official language: ',  'languageHeading')
//       const languageText        = createP('infoText',       `${country.languageName} (${country.languageNameLocal}).`,    'languageText')
//       createDivText(infoContainer, 'stringInfoContainer', [iconLanguage, languageHeading, languageText])
//
//       const closeButton         = createI('fas fa-times fa-lg', )
//       createDivText(infoContainer, 'closeButtonContainer', [closeButton], 'closeinfoButton')
//
//       aboutContainer.appendChild(infoContainer)
//
//       document.getElementById('closeinfoButton').onclick = () => {
//         document.getElementById('aboutCityArea').remove()
//       }
//     })
// }

function displayHeaderToUser (requiredText, headingContainerId) {
  const headingContainer = document.getElementById(headingContainerId)
  headingContainer.style.backgroundColor = '#76b675'
  headingContainer.style.borderBottom = '2px solid #549c53'
  const headingText = createP('headerText', requiredText, '', 'H1')
  return createDivText(headingContainer, 'headerTextContainer', [headingText])
}


// function createDivText (parent, className, children, id) {
//   const div = document.createElement('div')
//   div.className = className
//   children.forEach(child => div.appendChild(child))
//   if (id) {
//     div.id = id
//   }
//   parent.appendChild(div)
//   return div
// }
//
// function createI (className, id) {
//   const i = document.createElement('I')
//   i.className = className
//   if (id) {
//     i.id = id
//   }
//
//   return i
// }
//
// function createP (className, text, id, type) {
//   if (!type) type = 'P'
//   const p = document.createElement(type)
//   if (id) p.id = id
//   p.className = className
//   p.innerText = text
//   return p
// }

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

function displayTempToUser (data) {

  const weatherDiv = document.createElement('div')
  weatherDiv.className = 'weatherWidget'


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
  const description = document.createTextNode(`${capitalizer(data.weather.iconPhrase)}.`)
  const source = document.createTextNode(data.weather.source)

  dayNameContainer.appendChild(dayName)
  cityCountryContainer.appendChild(cityCountry)
  temperatureContainer.appendChild(temperature)
  descriptionContainer.appendChild(description)
  sourceContainer.appendChild(source)

  const divDisplayWeather = document.createElement('div')
  divDisplayWeather.id = data.weather.source.toLowerCase()
  divDisplayWeather.className = 'weatherWidgetContainer'
  divDisplayWeather.style.backgroundImage = `url(${widgetBackgrounds[`${data.weather.source}/${data.weather.iconId}`]})`

  weatherDiv.appendChild(dayNameContainer)
  weatherDiv.appendChild(cityCountryContainer)
  weatherDiv.appendChild(temperatureContainer)
  weatherDiv.appendChild(descriptionContainer)
  weatherDiv.appendChild(sourceContainer)
  divDisplayWeather.appendChild(weatherDiv)

  const allWeatherForcastContainer = document.createElement('div')
  allWeatherForcastContainer.className = 'widgetContainer'
  allWeatherForcastContainer.id = data.weather.source + 'Container'
  allWeatherForcastContainer.appendChild(divDisplayWeather)

  const mainContainer = document.getElementById('sectionContainer')
  mainContainer.appendChild(allWeatherForcastContainer)
}

const displayForecastToUser = (data) => {
  const forecastsDiv = document.createElement('div')
  forecastsDiv.className = 'forecastsContainer'
  const widgetsConatainer = document.getElementById(data.weather.source + 'Container')

  data.forecasts.forEach(day => {
    const forecastDiv = document.createElement('div')
    forecastDiv.className = ''
    forecastDiv.style.backgroundImage = `url(${widgetBackgrounds[`${data.weather.source}/${day.iconId}`]})`

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
    const description = document.createTextNode(`${capitalizer(day.iconPhrase)}.`)
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
  const description = document.createTextNode(`${capitalizer(historyCitySearch.iconPhrase)}.`)
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
  lastSearchDivWidget.style.backgroundImage = `url(${widgetBackgrounds[`${historyCitySearch.source}/${historyCitySearch.iconId}`]})`

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
    const description = document.createTextNode(`${capitalizer(weather.iconPhrase)}.`)
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
    lastSearchDivWidget.style.backgroundImage = `url(${widgetBackgrounds[`${weather.source}/${weather.iconId}`]})`

    lastSearchDivWidget.appendChild(dateTimeContainer)
    lastSearchDivWidget.appendChild(temperatureContainer)
    lastSearchDivWidget.appendChild(descriptionContainer)
    lastSearchDivWidget.appendChild(sourceContainer)

    historySourcesWidgetsContainer.appendChild(lastSearchDivWidget)
  })

  lastSearchDivCity.appendChild(historySourcesWidgetsContainer)

  return lastSearchDivCity
}
