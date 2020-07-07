window.fetch('/api/accu')
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
    const newDiv = document.createElement('input')
    newDiv.type = 'text'
    newDiv.value = data[0].Temperature.Metric.Value
    const accuWeather = document.getElementById('accuweather')
    accuWeather.appendChild(newDiv)
  })

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
