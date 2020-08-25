import React, {Component} from 'react'
import {handleApiResponse} from '../App.js'

import ContentColumnsContainer from './ContentColumnContainer'

export default class HistorySearchContainer extends Component {
  state = {
    cities: []
  }

  componentDidMount() {
    handleApiResponse( fetch(`/api/showhistory`) )
      .then(data => { this.setState({cities: data}) })
  }

  render() {
    return (
      <ContentColumnsContainer
        headerText='Last condition searches'
        data={this.state.cities}
      />
    )
  }
}
