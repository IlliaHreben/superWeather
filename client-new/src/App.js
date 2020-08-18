import React, {Component} from 'react'
import './App.css'
import debounce from 'lodash/debounce'
import InfoContainer from './Components/InfoContainer'

class App extends Component {

  render () {
    return (
      <ErrorBoundary>
        <Header id='cityNameContainer'/>
      </ErrorBoundary>
    )
  }
}

class Header extends Component {

  state = {
    isAboutClick: false,
    city: '',
    cityCountryData: {},
    citySentences: [],
    didRenderSentences: false,
    didRenderLoading: false
  }

  handleAbout = () => {
    jsonToData(fetch(`/api/aboutCity?cityName=${this.state.city}`))
      .then(cityCountryData => {
        this.setState({
          cityCountryData,
          isAboutClick: !this.state.isAboutClick
        })
      })
  }

  handleCloseButton = () => {
    this.setState({isAboutClick: !this.state.isAboutClick})
  }

  handleCityName = e => {
    this.setState({city: e.target.value})
    if (e.target.value || e.target.value !== '') {
      this.setState({didRenderLoading: true})
      return this.fetchCitySentences(e.target.value)

    } else {this.setState({didRenderSentences: false})}
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
        <button type='inputArea' id='about' onClick={this.handleAbout}>About</button>
        <input
          type='inputArea'
          id='cityName'
          placeholder='Enter your city here'
          value={this.state.city}
          onChange={this.handleCityName}
          autoComplete='off'
        />

        <label htmlFor='cityName'>Enter your city here</label>
        <button type='inputArea' id='search'>Search</button>
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
            />
          </ErrorBoundarySentences>
          )
          : null}
      </header>
    )
  }
}


class CitySentences extends Component {
  componentWillUnmount() {
    this.props.willUnmount()
  }
  render() {
    const cityCountryData = this.props.cityCountry
    const citySentencesStrings = cityCountryData.map(({country, city}) => (
      (
        <div className='citySentenceContainer' key={city.index}>
          <p className='cityNameSentence'>{`  ${city.name}, `}</p>
          <p className='countryNameSentence'>{country.name}</p>
          <p className='populationSentence'>{`${city.population} peoples`}</p>
        </div>
      )
    ))
    return (
      <div id='citySentences' key={'citySentences'}>
        {citySentencesStrings}
      </div>
    )
  }
}

class ErrorBoundarySentences extends Component {
  state = { error: null, errorInfo: null }

  componentDidCatch(error, errorInfo) {
    console.log(error.message)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return [
        <div id='citySentences'>
          <div className='citySentenceContainer'>
            <p className='countryNameSentence'>Can'not find city.</p>
          </div>
        </div>
      ]
    }
    return this.props.children;
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
