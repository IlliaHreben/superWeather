import React, {Component} from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'

const capitalizer = string => string.charAt(0).toUpperCase() + string.slice(1)

const widgetBackgrounds = require.context('../pictures/widgetPics', true, /\.(png|jpe?g|svg)$/)
function getImageUrl (source, imgName) {
  const path = `./${source}/${imgName}.png`
  return `url(${widgetBackgrounds(path)}`
}

export default class ContentColumnsContainer extends Component {
  state = {
    overflowActive: false,
    rightDisabled: false,
    startScroll: null
  }

  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ overflowActive: this.isContentOverflowed(this.div) })
    }
  }


  updateDimensions = debounce(() => {
    this.setState({ overflowActive: this.isContentOverflowed(this.div) })
  }, 200)
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  isContentOverflowed = e => {
    this.setState({fullWidth: e.scrollWidth, visibleWidth: e.offsetWidth})
    return e.scrollWidth > e.clientWidth;
  }


  scrollLeft = (element, change, duration) => {
    const start = element.scrollLeft
    const increment = 20
    let currentTime = 0
    console.log(start)
    this.setState({startScroll: start})

    const animateScroll = () => {
      currentTime += increment
      const val = easeInOutQuad(currentTime, start, change, duration)
      element.scrollLeft = val
      if(currentTime < duration) {
          setTimeout(animateScroll, increment)
      }
    }
    animateScroll()
  }

  render() {
    const overflowActive = this.state.overflowActive
    const marginColumnsContainer = overflowActive ? 'auto' : '1.5em'

    return (
      <div className='mainContainer'>

        <div className='mainContainerHeader'>
          <h1 className='headerText'>{this.props.headerText}</h1>
        </div>

        <div className='mainContainerContent'>

          {overflowActive ? <button
            className='left'
            onClick={() => this.scrollLeft(this.div, -300, 1000)}
            disabled={!(this.state.startScroll === 0)}
          >
            <FontAwesomeIcon icon={faCaretLeft} size='3x' />
          </button> : null}

          <div
            className='columnsContainer'
            ref={ref => (this.div = ref)}
            style={{marginLeft: marginColumnsContainer, marginRight: marginColumnsContainer}}
          >
            {this.props.data.map(source =>
              <OneWeatherContainer {...source}/>
            )}
          </div>

          {overflowActive ? <button
            className='right'
            onClick={() => this.scrollLeft(this.div, 300, 1000)}
            disabled={this.state.startScroll === 0}
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


const easeInOutQuad = (t, b, c, d) => {
  t /= d/2
	if (t < 1) return c/2*t*t + b
	t--
	return -c/2 * (t*(t-2) - 1) + b
}
