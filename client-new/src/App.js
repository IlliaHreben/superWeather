import React, {Component} from 'react'
import './App.css'
import debounce from 'lodash/debounce'
import InfoContainer from './Components/InfoContainer'
import {CitySentences, ErrorBoundarySentences} from './Components/CitySentences'
import moment from 'moment'


// import images from './pictures/widgetPics'

// const importAll = r => {
//   let images = {}
//   r.keys().map(item => { images[item.replace('/', '').replace('.png', '')] = r(item).default })
//   return images
// }

const widgetBackgrounds = require.context('./pictures/widgetPics', true, /\.(png|jpe?g|svg)$/)

function getImageUrl (source, imgName) {
  const path = `./${source}/${imgName}.png`
  return `url(${widgetBackgrounds(path)}`
}

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
          ? <WeathersContainer keyRequest={this.state.key} desiredValue={this.state.nameOrIndex}/>
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
      <header id='cityNameContainer'>
        <button type='inputArea' id='about' onClick={this.handleAbout}>About</button>
        <input
          type='inputArea'
          id='cityName'
          placeholder='Enter your city here'
          value={this.props.city}
          onChange={this.onInputChange}
          autoComplete='off'
        />

        <label htmlFor='cityName'>Enter your city here</label>
        <button type='inputArea' id='search' onClick={this.props.handleSearchButton}>Search</button>
        {this.state.didRenderLoading
          ? <i className='fas fa-spinner fa-spin' id='loadingIcon' key='loadingIcon' />
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
      </header>
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
    console.log(this.state.sources)
    return (
      <div className='mainContainer' id='sectionContainer'>
        <div className='mainContainerHeader' id='currentCondition'>
          <h1 className='headerText'>Current condition for requested city</h1>
        </div>
        {this.state.sources.map(source => {
          return <OneWeatherContainer source={source} />
        })}
      </div>
    )
  }
}

const OneWeatherContainer = props => {
  const {country, city, weather, forecasts} = props.source
  return (
    <div
      id={weather.source.toLowerCase()}
      className='widgetContainer'
    >
      <WeatherWidget country={country} city={city} weather={weather} backgroundPath={getImageUrl(weather.source, weather.iconId)}/>
      <div className='forecastsContainer'>
        {forecasts.map(day => {
          return (

              <WeatherWidget country={country} city={city} weather={day} backgroundPath={getImageUrl(weather.source, day.iconId)}/>

          )
        })}
      </div>
    </div>
  )
}

const WeatherWidget = props => {
  const capitalizer = string => string.charAt(0).toUpperCase() + string.slice(1)
  const {country, city, weather} = props
  console.log(moment(weather.date).isSame(Date.now(), 'day'))
  let dayName
  if (moment(weather.date).isSame(Date.now(), 'day')) {
    dayName = 'Today'
  } else if (weather.date) {dayName = moment(weather.date).format('dddd, Do')}

  const cityDateStyle = weather.date ? 'leftBottomString' : 'cityCountryCurrent'

  return (
    <div
      className='weatherWidget'
      style={{ backgroundImage: props.backgroundPath }}
    >
      {dayName ? <p className='mainString'>{dayName}</p> : null}
      <p className={cityDateStyle}>{`${city.name}, ${country.name}`}</p>
      {weather.temperatureMin ? <p className='temperatureMin'>{`${weather.temperatureMin}\u00B0C`}</p> : null}
      <p className='temperature'>{`${weather.temperature}\u00B0C`}</p>
      <p className='description'>{`${capitalizer(weather.iconPhrase)}.`}</p>
      {weather.source ? <p className='leftBottomString'>{weather.source}</p> : null}
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
