import React, {Component} from 'react'

import {handleApiResponse} from '../App.js'
import ContentColumnsContainer from './ContentColumnContainer'

export default class WeathersContainer extends Component {
  state = {
    sources: []
  }

  componentDidMount() {
    const key = this.props.keyRequest
    const desiredValue = this.props.desiredValue
    Promise
      .all(
        [
          // 'accu',
          'open',
          'yahoo'
        ].map(sourceName => handleApiResponse(fetch(`/api/${sourceName}?${key}=${desiredValue}`)) )
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
