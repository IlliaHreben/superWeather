document.getElementById('search').onclick = () => {

const cityName = document.getElementById('cityName').value

  window.fetch(`/api/showhistory?cityName=${cityName}`)
    .then(function (res) {
      return res.text()
        .then(JSON.parse)
        .then(body => {
          if (body.ok) {
            return body.data
          }
          throw body.error
        })
    })
    .then(data => {
      data[0].forEach((row) => {
        const textDate = `${row.temp}\u2103 (${formatDate(row.datetime)})`
        displayTempToUser(textDate, 'weatherHistory')
        console.log(typeof row.datetime)
      })
    })

  window.fetch(`/api/accu?cityName=${cityName}`)
    .then(function (res) {
      return res.text()
        .then(JSON.parse)
        .then(body => {
          if (body.ok) {
            return body.data
          }
          throw body.error
        })
    })
    .then(function (data) {
      displayTempToUser(data[0].Temperature.Metric.Value + '\u2103', 'accuweather')
    })

  window.fetch(`/api/open?cityName=${cityName}`)
    .then(function (res) {
      return res.text()
        .then(JSON.parse)
        .then(body => {
          if (body.ok) {
            return body.data
          }
          throw body.error
        })
    })
    .then(function (data) {
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

// [
//   {
//     "LocalObservationDateTime":"2020-02-25T21:16:00+02:00",
//     "EpochTime":1582658160,
//     "WeatherText":"Mostly cloudy",
//     "WeatherIcon":38,
//     "HasPrecipitation":false,
//     "PrecipitationType":null,
//     "IsDayTime":false,
//     "Temperature":{
//       "Metric":{
//         "Value":3.9,
//         "Unit":"C",
//         "UnitType":17
//       },
//       "Imperial":{
//         "Value":39.0,
//         "Unit":"F",
//         "UnitType":18
//       }
//     },
//     "MobileLink":"http://m.accuweather.com/en/ua/kyiv/324505/current-weather/324505?lang=en-us",
//     "Link":"http://www.accuweather.com/en/ua/kyiv/324505/current-weather/324505?lang=en-us"
//   }
// ]
