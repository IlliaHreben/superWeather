import React, {Component} from 'react'


import HistorySearch from './Components/HistorySearch'
import Weathers from './Components/Weathers'
import News from './Components/News'
import AirQuality from './Components/AirQuality'

import './App.css'
import Header from './Components/Header'

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

class App extends Component {
  state = {
    nameOrIndex: null,
    key: ''
  }

  componentDidMount () {
    getPosition()
      .then(({coords: {latitude, longitude}}) => handleApiResponse(
        fetch(`/api/getGeolocation?lat=${latitude}&lon=${longitude}`)) )
      .then(data => {
        this.setState({
          city: data.city.name,
          nameOrIndex: data.city.index,
          key: 'index',
        })
      })
  }

  handleCityName = cityName => {
    this.setState({nameOrIndex: cityName})
  }

  handleSearchButton = cityName => {
    this.setState({key: 'cityName', nameOrIndex: cityName})
  }

  handleOnClickSentence = index => {
    this.setState({
      key: 'index',
      nameOrIndex: index
    })
  }

  render () {

    return (
      <ErrorBoundary>
        <Header
          handleCityName={this.handleCityName}
          handleSearchButton={this.handleSearchButton}
          handleOnClickSentence={this.handleOnClickSentence}
        />
        {this.state.key
          ? (
              <>
                <div className='containerForMainContainers'>
                  <Weathers keyRequest={this.state.key} desiredValue={this.state.nameOrIndex}/>
                  <HistorySearch />
                  <AirQuality keyRequest={this.state.key} nameOrIndex={this.state.nameOrIndex}/>
                </div>
                <News keyRequest={this.state.key} nameOrIndex={this.state.nameOrIndex}/>
              </>
            )
          : null
        }
            </ErrorBoundary>
    )
  }
}



class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null }


  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export const handleApiResponse = promise => {
  return promise
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
}


export default App
