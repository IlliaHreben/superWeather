document.getElementById('search').onclick = () => {

  const cityName = document.getElementById('cityName').value

  const promiseYahoo = window.fetch(`/api/yahoo?cityName=${cityName}`)
  const promiseOpen = window.fetch(`/api/open?cityName=${cityName}`)
  const promiseAccu = window.fetch(`/api/accu?cityName=${cityName}`)
  const promiseGetHistory = window.fetch(`/api/showhistory?cityName=${cityName}`)

  jsonToData(promiseGetHistory)
    .then(data => {
      data.forEach(row => {
        const textDate = `${row.temperature}\u2103 (${formatDate(row.createdAt)})`
        displayTempToUser(textDate, 'weatherHistory', 'weatherWidget')
      })
    })

  jsonToData(promiseAccu)
    .then(data => {
      displayTempToUser(data.weather.temperature + '\u2103', data.city.source.toLowerCase(), 'weatherWidget')
    })

  jsonToData(promiseOpen)
    .then(data => {
      displayTempToUser(data.weather.temperature + '\u2103', data.city.source.toLowerCase(), 'weatherWidget')
    })

  jsonToData(promiseYahoo)
    .then(data => {
      displayTempToUser(data.weather.temperature + '\u2103', data.city.source.toLowerCase(), 'weatherWidget')
    })
}

document.getElementById('about').onclick = () => {
  const cityName = document.getElementById('cityName').value
  if (!cityName || cityName === '') {
    console.log(`You did not enter the city name.`)
    displayTempToUser(`You did not enter the city name.`, 'error', 'errorMessage')
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

function displayTempToUser (value, divTempId, divClass) {
  const newDiv = document.createElement('input')
  newDiv.type = 'text'
  newDiv.value = value
  newDiv.className = divClass
  const divDisplayWeather = document.getElementById(divTempId)
  divDisplayWeather.appendChild(newDiv)
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
