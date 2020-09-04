// const fetch = require('node-fetch')
//
// const {ambeeKey} = require('../../config')
//
// const openGetOneCall = (lat, lon) => {
//   return fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKeyOpenWeather}`)
//     .then(resApi => resApi.json())
// }
//
//  module.exports = {openGetOneCall}

return fetch('https://api.ambeedata.com/latest/by-lat-lng?lat=30.5238&lng=50.45466', {
    method: 'GET',
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'x-api-key': 'uDo874l2eS2cZu0cGWGBR9udKtfi9S1f4aPFL45p'
    }
  })
    .then(resApi => resApi.json())
    .then(reply => {
          console.log('success');
          console.log(reply);
      }).catch(err => {
          console.log('error');
          console.log(err);
      });
