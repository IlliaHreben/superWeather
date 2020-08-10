const {sendPromiseToClient} = require('./homeController')
const {getCityCountryByName} = require('./getCityCountry')

const getCitySentences = (req, res) => {
  const promise = Promise.resolve(getCityCountryByName(req.query.cityName))

  sendPromiseToClient(res, promise)
}

module.exports = getCitySentences
