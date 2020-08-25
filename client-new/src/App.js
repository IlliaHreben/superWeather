import React, {Component} from 'react'
import debounce from 'lodash/debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import HistorySearch from './Components/HistorySearch'
import Weathers from './Components/Weathers'
import News from './Components/News'
import InfoContainer from './Components/InfoContainer'
import {CitySentences, ErrorBoundarySentences} from './Components/CitySentences'
import './App.css'

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

class App extends Component {
  state = {
    didRenderWeather: false,
    city: '',
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
          didRenderWeather: true
        })
      })
  }

  handleCityName = cityName => {
    this.setState({nameOrIndex: cityName, city: cityName})
  }

  handleSearchButton = () => {
    this.setState({didRenderWeather: true, key: 'cityName'})
  }

  handleOnClickSentence = (index, name) => {
    this.setState({
      key: 'index',
      nameOrIndex: index,
      didRenderWeather: true,
      city: name
    })
  }

  render () {
    return (
      <ErrorBoundary>
        <Header
          city={this.state.city}
          handleCityName={this.handleCityName}
          handleSearchButton={this.handleSearchButton}
          handleOnClickSentence={this.handleOnClickSentence}
        />
        {this.state.didRenderWeather
          ? ([
              <div className='containerForMainContainers' key='containerForMainContainers'>
                <Weathers keyRequest={this.state.key} desiredValue={this.state.nameOrIndex} key='weathersContainer'/>
                <HistorySearch key='historySearchContainer'/>
              </div>,
              <News key='news' keyRequest={this.state.key} nameOrIndex={this.state.nameOrIndex}/>
            ])
          : null
        }
            </ErrorBoundary>
    )
  }
}

class Header extends Component {

  state = {
    isAboutClick: false,
    cityCountryData: {},
    citySentences: [],
    didRenderSentences: false,
    didRenderLoading: false
  }

  onInputChange = e => {
    const cityName = e.target.value
    this.props.handleCityName(cityName)
    if (cityName && cityName !== '') {
      this.setState({didRenderLoading: true})
      return this.fetchCitySentences(cityName)

    } else {this.setState({didRenderSentences: false})}
  }

  handleAbout = () => {
    handleApiResponse(fetch(`/api/aboutCity?cityName=${this.props.city}`))
    .then(cityCountryData => {
      this.setState({
        cityCountryData,
        isAboutClick: !this.state.isAboutClick
      })
    })
  }

  handleOnClickSentence = (index, name) => {
    this.setState({didRenderSentences: false})
    this.props.handleOnClickSentence(index, name)
  }

  handleCloseButton = () => {
    this.setState({isAboutClick: !this.state.isAboutClick})
  }

  citySentencesWillUnmount = () => {
    this.setState({didRenderLoading: false})
    this.fetchCitySentences.cancel()
  }

  fetchCitySentences = debounce(cityName => {
    return handleApiResponse( fetch(`/api/searchSentence?cityName=${cityName}`) )
    .catch(() => [] )
    .then(citySentences => this.setState({
      citySentences,
      didRenderSentences: true,
      didRenderLoading: false
    }))

  }, 600)



  render () {
    return (
      <header>
        <div id='cityNameContainer'>
          <button className='headerButton' id='about' onClick={this.handleAbout}>About</button>
          <input
            type='text'
            id='cityName'
            value={this.props.city}
            onChange={this.onInputChange}
            autoComplete='off'
            required
          />
          <label htmlFor='cityName' className='cityNameLabel'>Enter your city here</label>
          <button className='headerButton' id='search' onClick={this.props.handleSearchButton}>Search</button>
          {this.state.didRenderLoading
            ? <FontAwesomeIcon icon={faSpinner} spin id='loadingIcon'/>
            : null
          }


          {this.state.isAboutClick ? (
            <div className='aboutContainer' id='aboutCityArea'>
              <div className='infoContainer' id='infoContainer'>
                <InfoContainer
                  cityInfo={this.state.cityCountryData}
                  onClickClose={this.handleCloseButton}
                />
              </div>
            </div>
          ) : null}

          {this.state.didRenderSentences
            ? (<ErrorBoundarySentences>
              <CitySentences
                willUnmount={this.citySentencesWillUnmount}
                cityCountry={this.state.citySentences}
                onClick={this.handleOnClickSentence}
              />
            </ErrorBoundarySentences>
            )
            : null}
        </div>
      </header>
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
