const {newsApiKey, language} = require('../../config')
const {sendPromiseToClient, getCityCountry} = require('./homeController')
const ServiceError = require('../../ServiceError')

const NewsAPI = require('newsapi')
const newsApi = new NewsAPI(newsApiKey)



const getNews = (req, res) => {
  if (!req.query.index && !req.query.cityName) {
    sendPromiseToClient(res,
      Promise.reject(new ServiceError('Data did not come from the server', 'NO_DATA_COME'))
    )
    return
  }

  const {country, city} = getCityCountry(req.query)

  const promise =  async () => {
    try {
      let response

      response = await newsApi.v2.everything({
        q: city.name,
        language: country.languageCode || language,
        sortBy: 'publishedAt',
        pageSize: 5
      })

      if (response.status !== 'ok') {
        throw new Error(response.message)
      }
      if (response.totalResults === 0) {
        response = await newsApi.v2.everything({
          q: country.name,
          language: country.languageCode || language,
          sortBy: 'publishedAt',
          pageSize: 5
        })
      }
      if (response.totalResults === 0) {
        response = await newsApi.v2.everything({
          q: 'news',
          language,
          sortBy: 'publishedAt',
          pageSize: 5
        })
      }

      return formatNews(response.articles)
    } catch (err) {
      if (err.code === 400) {throw new ServiceError('Wat da city????', 'CITY_NEWS_NOT_FOUND') }
      throw new Error(err.message)
    }
  }

  sendPromiseToClient(res, promise())
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
