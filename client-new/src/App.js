import React, {Component} from 'react'
import './App.css'
import debounce from 'lodash/debounce'
import InfoContainer from './Components/InfoContainer'
import {CitySentences, ErrorBoundarySentences} from './Components/CitySentences'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


const widgetBackgrounds = require.context('./pictures/widgetPics', true, /\.(png|jpe?g|svg)$/)

function getImageUrl (source, imgName) {
  const path = `./${source}/${imgName}.png`
  return `url(${widgetBackgrounds(path)}`
}

const capitalizer = string => string.charAt(0).toUpperCase() + string.slice(1)

class App extends Component {
  state = {
    didRenderWeather: false,
    city: '',
    nameOrIndex: null,
    key: ''

  }

  handleCityName = cityName => {
    this.setState({nameOrIndex: cityName, city: cityName})
  }

  handleSearchButton = () => {
    this.setState({didRenderWeather: true, key: 'cityName'})
  }

  handleOnClickSentence = index => {
    this.setState({key: 'index', nameOrIndex: index, didRenderWeather: true})
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
              <WeathersContainer keyRequest={this.state.key} desiredValue={this.state.nameOrIndex} key='weathersContainer'/>,
              <HistorySearchContainer key='historySearchContainer'/>
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
    jsonToData(fetch(`/api/aboutCity?cityName=${this.props.city}`))
    .then(cityCountryData => {
      this.setState({
        cityCountryData,
        isAboutClick: !this.state.isAboutClick
      })
    })
  }

  handleOnClickSentence = index => {
    this.setState({didRenderSentences: false})
    this.props.handleOnClickSentence(index)
  }

  handleCloseButton = () => {
    this.setState({isAboutClick: !this.state.isAboutClick})
  }

  citySentencesWillUnmount = () => {
    this.setState({didRenderLoading: false})
    this.fetchCitySentences.cancel()
  }

  fetchCitySentences = debounce(cityName => {
    return jsonToData( fetch(`/api/searchSentence?cityName=${cityName}`) )
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
            // placeholder='Enter your city here'
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

class HistorySearchContainer extends Component {
  state = {
    cities: []
  }

  componentDidMount() {
    jsonToData( fetch(`/api/showhistory`) )
      .then(data => { this.setState({cities: data}) })
  }

  render() {
    return (
      <div className='mainContainer' id='lastSearchesContainer'>
        <div className='mainContainerHeader' id='lastSearches'>
          <h1 className='headerText'>Last condition searches</h1>
        </div>
        {this.state.cities.map(city => {
          return <OneWeatherContainer source={city} key={city.city.index}/>
        })}
      </div>
    )
  }
}

class WeathersContainer extends Component {
  state = {
    sources: []
  }

  componentDidMount() {
    const key = this.props.keyRequest
    const desiredValue = this.props.desiredValue
    jsonToData(fetch(`/api/accu?${key}=${desiredValue}`))
      .then(data => {
        this.setState(state => ({sources: [...state.sources, data]} ))
      })

    jsonToData(fetch(`/api/open?${key}=${desiredValue}`))
      .then(data => {
        this.setState(state => ({sources: [...state.sources, data]} ))
      })

    jsonToData(fetch(`/api/yahoo?${key}=${desiredValue}`))
      .then(data => {
        this.setState(state => ({sources: [...state.sources, data]} ))
      })
  }

  render() {
    return (
      <div className='mainContainer' id='sectionContainer'>
        <div className='mainContainerHeader' id='currentCondition'>
          <h1 className='headerText'>Current condition for requested city</h1>
        </div>
        {this.state.sources.map(source => {
          return <OneWeatherContainer source={source} key={source.weather.source}/>
        })}
      </div>
    )
  }
}

const OneWeatherContainer = props => {
  const {country, city, weather, forecasts, weathers} = props.source
  const dropDownElements = forecasts ? forecasts : weathers
  const backgroundSource = weather.backgroundSource || weather.source

  return (
    <div className='widgetContainer' >
      <WeatherWidget country={country} city={city} weather={weather} backgroundPath={getImageUrl(backgroundSource, weather.iconId)}/>
      <div className='dropDownContainer'>
        {dropDownElements.map(dropDownElement => {
          const source = weathers ? dropDownElement.source : backgroundSource
          return (
            <WeatherWidget
              country={country}
              city={city}
              weather={dropDownElement}
              backgroundPath={getImageUrl(source, dropDownElement.iconId)}
              key={dropDownElement.source || dropDownElement.date}
            />
          )
        })}
      </div>
    </div>
  )
}

const WeatherWidget = props => {

  const {country, city, weather} = props
  let dayName
  if (!weather.updatedAt && moment(weather.date).isSame(Date.now(), 'day')) {
    dayName = 'Today'
  } else if (weather.date) {dayName = moment(weather.date).format('dddd, Do')}

  let cityCountryClass
  if (weather.date) {cityCountryClass = 'leftBottomString'}
  else if (weather.updatedAt && !weather.source) {cityCountryClass = 'mainString'}
  else {cityCountryClass = 'cityCountryCurrent'}

   // weather.date ? 'leftBottomString' : 'cityCountryCurrent'
  const sourceClass = weather.updatedAt ? 'mainString' : 'leftBottomString'
  // const cityCountryClass = weather.updatedAt && !weather.source ? 'mainString' : 'leftBottomString'

  return (
    <div
      className='weatherWidget'
      style={{ backgroundImage: props.backgroundPath }}
    >
      {dayName ? <p className='mainString'>{dayName}</p> : null}
      {!(weather.updatedAt && weather.source) ? <p className={cityCountryClass}>{`${city.name}, ${country.name}`}</p> : null}
      {weather.temperatureMin ? <p className='temperatureMin'>{`${weather.temperatureMin}\u00B0C`}</p> : null}
      <p className='temperature'>{`${weather.temperature}\u00B0C`}</p>
      <p className='description'>{`${capitalizer(weather.iconPhrase)}.`}</p>
      {weather.source ? <p className={sourceClass}>{weather.source}</p> : null}
      {weather.updatedAt ? <p className='leftBottomString'>{moment(weather.updatedAt).format('dddd, Do')}</p> : null}
    </div>
  )
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

const jsonToData = promise => {
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


export default App;
