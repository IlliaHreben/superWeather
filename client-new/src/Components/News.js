import React, {Component} from 'react'
import moment from 'moment'
import {handleApiResponse} from '../App.js'

export default class News extends Component {
  state = {
    news: []
  }

  componentDidMount () {
    this.fetchNews(this.props.keyRequest, this.props.nameOrIndex)
  }

  componentDidUpdate (prevProps) {
    if (prevProps !== this.props) {
      this.fetchNews(this.props.keyRequest, this.props.nameOrIndex)
    }
  }

  fetchNews = (key, value) => {
    return handleApiResponse(fetch(`/api/news?${key}=${value}`))
    .then(news => {
      this.setState({news})
    })
  }

  render () {
    return (
      <div className='newsContainer'>
        <div className='newsHeader'>
          <p className='headerText'>HOT NEWS FROM YOURE CITY! ENJOY :)</p>
        </div>
        {this.state.news.map(oneNew => <OneNew key={oneNew.url} newData={oneNew}/>)}
      </div>
    )
  }
}

const OneNew = props => {
  const {source, title, author, description, url, imageUrl, publishedAt, content} = props.newData

  return (
    <a href={url}>
      <div className='oneNew'>
        <div className='newsTextContainer'>
          <img className='newsFavicon' src={url.match(/([^/]*\/){3}/)[0] + 'favicon.ico'} alt=''/>
          <p className='newsSource'>{source}</p>
          <p className='newsAuthor'>{author}</p>
          <p className='newsTitle'>{title}</p>
          <p className='newsDescription'>{description}</p>
          <p className='newsPublishedAt'>{moment(publishedAt).fromNow()}</p>
        </div>
        <img className='newsImage' src={imageUrl} alt=''/>
      </div>
    </a>
  )
}
