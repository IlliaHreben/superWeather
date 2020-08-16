import React, {Component} from 'react';
import './App.css';

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
      cityCountryData: {}
    }

    this.handleAbout = this.handleAbout.bind(this)
    this.handleCityName = this.handleCityName.bind(this)
  }

  handleAbout() {
    jsonToData(window.fetch(`/api/aboutCity?cityName=${this.state.city}`))
      .then(cityCountryData => {
        this.setState({
          cityCountryData,
          isAboutClick: !this.state.isAboutClick
        })

        document.getElementById('closeinfoButton').onclick = () => {
          document.getElementById('aboutCityArea').remove()
        }
      })
  }

  handleCityName(e) {
    this.setState({city: e.target.value})
  }

  render () {
    const headerContent = [
      <button type='inputArea' id='about' onClick={this.handleAbout}>About</button>,
      <input type='inputArea' id='cityName' placeholder='Enter your city here' value={this.state.city} onChange={this.handleCityName}></input>,
      <label for='cityName'>Enter your city here</label>,
      <i class='fas fa-spinner fa-spin' id='loadingIcon'></i>,
      <div id='citySentences'></div>,
      <button type='inputArea' id='search'>Search</button>
    ]
    if (this.state.isAboutClick) {
      headerContent.push(
        <div class='aboutContainer' id='aboutCityArea'>
          <div class='infoContainer' id='infoContainer'>
            <InfoContainer cityInfo={this.state.cityCountryData}/>
          </div>
        </div>
      )

    }

    return (
      <header>
        {headerContent}
      </header>
    )
  }
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
      <InfoAboutCityString
        class='closeButtonContainer' key='closeButton'
        iconClass='fas fa-times fa-lg' iconID='closeinfoButton'
      />,
    ])
  }
}

const InfoAboutCityString = (props) => {
  const outputElements = []

  if (props.iconClass) outputElements.push(
    <i class={props.iconClass} id={props.iconID}/>
  )
  if (props.stringClass) outputElements.push(
    <p class={props.stringClass} id={props.stringID}>{props.value}</p>
  )
  if (props.stringHeaderClass) outputElements.push(
    <p class={props.headerClass} id={props.stringID}>{props.value}</p>
  )
  return outputElements
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
