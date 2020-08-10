const OAuth = require('oauth')

const {consumerKeyYahoo, consumerSecretYahoo} = require('../../config')
const ServiceError = require('../../ServiceError')

const yahooRequest = new OAuth.OAuth(
    null,
    null,
    consumerKeyYahoo,
    consumerSecretYahoo,
    '1.0',
    null,
    'HMAC-SHA1',
    null,
    {'X-Yahoo-App-Id': 'BHSaSz1y'} //header
)

const yahooGetCurrentForecast = (lat, lon) => {
  return new Promise((resolve, reject) => {
    yahooRequest.get(
      `https://weather-ydn-yql.media.yahoo.com/forecastrss?lat=${lat}&lon=${lon}&format=json&u=c`,
      null,
      null,
      (err, data) => err ? reject(err) : resolve(data)  //3-d - result
    )
  })
    .then(JSON.parse)
}


 module.exports = yahooGetCurrentForecast
