import React, {Component} from 'react';
import './App.css';
import debounce from 'lodash/debounce'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
      <Header id='cityNameContainer'/>
    )
  }
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAboutClick: false,
      city: '',
      cityCountryData: {},
      sentencesStrings: [],
      didRenderSentences: false,
      didRenderLoading: false
    }

    this.handleAbout = this.handleAbout.bind(this)
    this.handleCityName = this.handleCityName.bind(this)
    this.handleCloseButton = this.handleCloseButton.bind(this)
    this.citySentencesWillUnmount = this.citySentencesWillUnmount.bind(this)
  }

  handleAbout() {
    jsonToData(window.fetch(`/api/aboutCity?cityName=${this.state.city}`))
      .then(cityCountryData => {
        this.setState({
          cityCountryData,
          isAboutClick: !this.state.isAboutClick
        })
      })
  }

  handleCloseButton() {
    this.setState({isAboutClick: !this.state.isAboutClick})
  }

  handleCityName(e) {
    this.setState({city: e.target.value})
    if (e.target.value || e.target.value !== '') {
      this.setState({didRenderLoading: true})
      this.debouncer(e.target.value)

    } else {this.setState({didRenderSentences: false})}
  }

  citySentencesWillUnmount() {
    this.setState({
      sentencesStrings: [],
      didRenderLoading: false
    })
    this.debouncer.cancel()
  }

  debouncer = debounce(cityName => {
    return jsonToData(
      window.fetch(`/api/searchSentence?cityName=${cityName}`)
    )
      .then(citySentences => {
        if (citySentences) {
          return citySentences.map(({country, city}) => ([
            city.index,
            (
              <div className='citySentenceContainer'>
                <p className='cityNameSentence'>{`  ${city.name}, `}</p>
                <p className='countryNameSentence'>{country.name}</p>
                <p className='populationSentence'>{`${city.population} peoples`}</p>
              </div>
            )
          ]))
        } else {return []}
      })
      .then(sentencesStrings => this.setState({
        sentencesStrings,
        didRenderSentences: true
      }))
      .then(() => this.setState({didRenderLoading: false}))
  }, 600)

  render () {
    return (
      <header>
        <button type='inputArea' id='about' onClick={this.handleAbout}>About</button>
        <input type='inputArea' id='cityName' placeholder='Enter your city here' value={this.state.city} onChange={this.handleCityName} />

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

        {this.state.didRenderSentences ? (
          <CitySentences
            sentencesStrings={this.state.sentencesStrings}
            willUnmount={this.citySentencesWillUnmount}
          />
        ) : null}
      </header>
    )
  }
}

class CitySentences extends Component {
  constructor(props) {
    super(props)
  }
  componentWillUnmount() {
    this.props.willUnmount()
  }
  render() {
    return (
      <div id='citySentences' key={'citySentences'}>
        {this.props.sentencesStrings.map(strings => strings[1])}
      </div>
    )
  }
    // .then(citySentenceDivs => {
    //   citySentenceDivs.forEach(citySentenceDiv => {
    //     citySentenceDiv[1].onclick = () => {
    //       citySentencesContainer.style.height = '0'
    //       citySentencesContainer.style.visibility = 'hidden'
    //       citySentencesContainer.style.opacity = '0'
    //       fetchWeatherForecastsHistory('index', citySentenceDiv[0])
    //     }
    //   })
    // })
}

class InfoContainer extends Component {
  constructor(props) {
    super(props)
    }

  render() {
    const {country, city} = this.props.cityInfo

    return ([
      <InfoAboutCityString
        class='headingContainer' key='nameCountry'
        stringClass='headingName' stringID='nameCountry'
        value={`${city.name}, ${country.name} (${country.nameLocal})`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='population'
        iconClass='fas fa-users fa-lg'
        headerClass='headingFat' headerID='populationHeading' headerValue='Population: '
        stringClass='infoText' stringID='populationText' value={`${city.population} peoples.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='region'
        iconClass='fas fa-globe fa-lg'
        headerClass='headingFat' headerID='regionHeading' headerValue='Region: '
        stringClass='infoText' stringID='regionText' value={`${country.region}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='coordinates'
        iconClass='fas fa-map-marked-alt fa-lg'
        headerClass='headingFat' headerID='coordinatesHeading' headerValue='Coordinates: '
        stringClass='infoText' stringID='coordinatesText' value={`${city.latitude}, ${city.longitude}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='currency'
        iconClass='fas fa-wallet fa-lg'
        headerClass='headingFat' headerID='currencyHeading' headerValue='Currency code: '
        stringClass='infoText' stringID='currencyText' value={`${country.currencyCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='callingCode'
        iconClass='fas fa-phone fa-lg'
        headerClass='headingFat' headerID='callingCodeHeading' headerValue='Country calling code: '
        stringClass='infoText' stringID='callingCodeText' value={`${country.callingCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='language'
        iconClass='fas fa-language fa-lg'
        headerClass='headingFat' headerID='languageHeading' headerValue='Official language: '
        stringClass='infoText' stringID='languageText' value={`${country.languageName} (${country.languageNameLocal}).`}
      />,
      <CloseButton
        class='closeButtonContainer' key='closeButton'
        iconClass='fas fa-times fa-lg' iconID='closeinfoButton'
        onClick={this.props.onClickClose}
      />,
    ])
  }
}

const InfoAboutCityString = props => {
  const outputElements = []

  if (props.iconClass) outputElements.push(
    <i className={props.iconClass} id={props.iconID} key={props.iconID}/>
  )
  if (props.headerClass) outputElements.push(
    <p className={props.headerClass} id={props.headerID} key={props.headerID}>{props.headerValue}</p>
  )
  if (props.stringClass) outputElements.push(
    <p className={props.stringClass} id={props.stringID} key={props.stringID}>{props.value}</p>
  )

  return (
    <div className={props.class}>
      {outputElements}
    </div>
  )
}

const CloseButton = props => {
  return (
    <div className={props.class}>
      <i className={props.iconClass} id={props.iconID} onClick={props.onClick}/>
    </div>
  )
}

const jsonToData = (promise) => {
  return promise
    .then(res => res.text())
    .then(JSON.parse)
    .then(body => {
      if (body.ok) {
        return body.data
      }
      throw body.error
    })
    .catch(err => {
      console.log(err)
    })
}


export default App;
