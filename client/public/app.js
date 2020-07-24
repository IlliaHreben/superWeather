document.getElementById('search').onclick = () => {

  const cityName = document.getElementById('cityName').value

  const promiseYahoo = window.fetch(`/api/yahoo?cityName=${cityName}`)
  const promiseOpen = window.fetch(`/api/open?cityName=${cityName}`)
  const promiseAccu = window.fetch(`/api/accu?cityName=${cityName}`)
  const promiseGetHistory = window.fetch(`/api/showhistory?cityName=${cityName}`)

  jsonToData(promiseGetHistory)
    .then(data => {
      data.forEach((row) => {
        const textDate = `${row.temp}\u2103 (${formatDate(row.createdAt)})`
        displayTempToUser(textDate, 'weatherHistory')
      })
    })

  jsonToData(promiseAccu)
    .then(data => {
      displayTempToUser(data.temp + '\u2103', data.source.toLowerCase())
    })

  jsonToData(promiseOpen)
    .then(data => {
      displayTempToUser(data.temp + '\u2103', data.source.toLowerCase())
    })

  jsonToData(promiseYahoo)
    .then(data => {
      displayTempToUser(data.temp + '\u2103', data.source.toLowerCase())
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
}

function displayTempToUser (value, divTempId) {
  const newDiv = document.createElement('input')
  newDiv.type = 'text'
  newDiv.value = value
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
