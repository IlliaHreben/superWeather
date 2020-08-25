import React, {Component} from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'

const capitalizer = string => string.charAt(0).toUpperCase() + string.slice(1)

const widgetBackgrounds = require.context('../pictures/widgetPics', true, /\.(png|jpe?g|svg)$/)
function getImageUrl (source, imgName) {
  const path = `./${source}/${imgName}.png`
  return `url(${widgetBackgrounds(path)}`
}

export default class ContentColumnsContainer extends Component {
  state = {
    position: 0,
    overflowActive: false,
    rightDisabled: false,
    fullWidth: null,
    visibleWidth: null,
  }

  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data)
    this.setState({ overflowActive: this.isContentOverflowed(this.div) })
  }

  isContentOverflowed = e => {
    this.setState({fullWidth: e.scrollWidth, visibleWidth: e.offsetWidth})
    console.log(e.scrollWidth, e.clientWidth, e.offsetWidth)
    return e.scrollWidth > e.clientWidth;
  }

  moveLeft = () => {
    const fullWidth = this.state.fullWidth
    const visibleWidth = this.state.visibleWidth
    const moveDistance = (fullWidth - visibleWidth - 326) < 0 ? fullWidth - visibleWidth + 60 : 326
    this.setState(({position}) => ({
      position: position + moveDistance,
      rightDisabled: false
    }) )
  }

  moveRight = () => {
    const fullWidth = this.state.fullWidth
    const visibleWidth = this.state.visibleWidth
    const moveDistance = (fullWidth - visibleWidth - 326) < 0 ? fullWidth - visibleWidth + 60 : 326
    if ((fullWidth - visibleWidth - 326) < 0) this.setState({rightDisabled: true})
    this.setState(({position}) => ({position: position - moveDistance}) )
  }


  render() {
    const columnsPosition = this.state.position
    return (
      <div className='mainContainer'>

        <div className='mainContainerHeader'>
          <h1 className='headerText'>{this.props.headerText}</h1>
        </div>

        <div className='mainContainerContent'>

          {this.state.overflowActive ? <button
            className='left'
            onClick={this.moveLeft}
            disabled={!columnsPosition}
          >
            <FontAwesomeIcon icon={faCaretLeft} size='3x' />
          </button> : null}

          <div
            className='columnsContainer'
            style={{left: columnsPosition + 'px'}}
            ref={ref => (this.div = ref)}
          >
            {this.props.data.map(source =>
              <OneWeatherContainer {...source}/>
            )}
          </div>

          {this.state.overflowActive ? <button
            className='right'
            onClick={this.moveRight}
            disabled={this.state.rightDisabled}
          >
            <FontAwesomeIcon icon={faCaretRight} size='3x' />
          </button> : null}

        </div>

      </div>
    )
  }
}

const OneWeatherContainer = props => {
  const {country, city, weather, forecasts, weathers} = props
  const dropDownElements = forecasts ? forecasts : weathers
  const backgroundSource = weather.backgroundSource || weather.source

  return (
    <div className='widgetContainer' >
      <WeatherWidget
        country={country}
        city={city}
        weather={weather}
        backgroundPath={getImageUrl(backgroundSource, weather.iconId)}
      />
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

  const sourceClass = weather.updatedAt ? 'mainString' : 'leftBottomString'

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
