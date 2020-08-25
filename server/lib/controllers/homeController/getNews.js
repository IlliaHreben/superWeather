const {newsApiKey, language} = require('../../config')
const {sendPromiseToClient, getCityCountry} = require('./homeController')
const ServiceError = require('../../ServiceError')

const NewsAPI = require('newsapi')
const newsApi = new NewsAPI(newsApiKey)



const getNews = (req, res) => {
  console.log(req.query)
  if (!req.query.index && !req.query.cityName) {
    return Promise.reject(new ServiceError('Data did not come from the client', 'NO_DATA_COME'))
  }

  const {country, city} = getCityCountry(req.query)

  const promise =  newsApi.v2.everything({
    q: country.name,
    language: country.languageCode || language,
    sortBy: 'publishedAt',
    pageSize: 5
  })
    .then(response => {
      if (response.status !== 'ok') {
        throw new Error(response.message)
      }
      return formatNews(response.articles)
    })
    .catch(err => {
      if (err.code === 400) {throw new ServiceError('Wat da city????', 'CITY_NEWS_NOT_FOUND') }
      throw new Error(err.message)
    })

  sendPromiseToClient(res, promise)
}

const formatNews = news => {
  return news.map(oneNew => ({
    source: oneNew.source.name,
    author: oneNew.author,
    title: oneNew.title,
    description: oneNew.description,
    url: oneNew.url,
    imageUrl: oneNew.urlToImage,
    publishedAt: oneNew.publishedAt,
    content: oneNew.content
  }))
}

module.exports = getNews
