document.getElementById('search').onclick = () => {

  const cityName = document.getElementById('cityName').value

  const promiseYahoo = window.fetch(`/api/yahoo?cityName=${cityName}`)
  const promiseOpen = window.fetch(`/api/open?cityName=${cityName}`)
  const promiseAccu = window.fetch(`/api/accu?cityName=${cityName}`)
  const promiseGetHistory = window.fetch(`/api/showhistory?cityName=${cityName}`)

  jsonToData(promiseGetHistory)
    .then(data => {
      data.forEach((row) => {
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
