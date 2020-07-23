document.getElementById('search').onclick = () => {

const cityName = document.getElementById('cityName').value

  window.fetch(`/api/showhistory?cityName=${cityName}`)
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .then(data => {
      console.log(data)
      data.forEach((row) => {
        const textDate = `${row.temp}\u2103 (${formatDate(row.createdAt)})`
        displayTempToUser(textDate, 'weatherHistory')
        console.log(typeof row.datetime)
      })
    })

  window.fetch(`/api/accu?cityName=${cityName}`)
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .then(data => {
      displayTempToUser(data[0].Temperature.Metric.Value + '\u2103', 'accuweather')
    })

  window.fetch(`/api/open?cityName=${cityName}`)
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .then(data => {
      displayTempToUser(data.list[0].main.temp + '\u2103', 'openweather')
    })

  window.fetch(`/api/yahoo?cityName=${cityName}`)
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .then(data => {
      displayTempToUser(data.current_observation.condition.temperature + '\u2103', 'yahooweather')
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
