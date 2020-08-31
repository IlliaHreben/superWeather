import React, {Component} from 'react'

import {handleApiResponse} from '../App.js'
import ContentColumnsContainer from './ContentColumnContainer'

export default class WeathersContainer extends Component {
  state = {
    sources: []
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.fetchWeather(this.props.keyRequest, this.props.desiredValue)
    }
  }

  componentDidMount() {
    this.fetchWeather(this.props.keyRequest, this.props.desiredValue)
  }

  fetchWeather = (key, value) => {
    return Promise
      .all(
        [
          'accu',
          'open',
          'yahoo'
        ].map(sourceName => handleApiResponse(fetch(`/api/${sourceName}?${key}=${value}`)) )
      )
      .catch(err => console.log(err))
      .then(sourcesData => this.setState({sources: sourcesData}) )
    }

  render() {
    return (
      <ContentColumnsContainer
        headerText='Current condition for requested city'
        data={this.state.sources}
      />
    )
  }
}
