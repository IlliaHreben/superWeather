import React, {Component} from 'react'

import InfoContainer from './InfoContainer'
import {CitySentences, ErrorBoundarySentences} from './CitySentences'
import {handleApiResponse} from '../App.js'
import debounce from 'lodash/debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default class Header extends Component {

  state = {
    isAboutClick: false,
    cityCountryData: {},
    citySentences: [],
    didRenderSentences: false,
    didRenderLoading: false,
    cityName: ''
  }

  onInputChange = e => {
    const cityName = e.target.value
    this.setState({cityName})
    if (cityName && cityName !== '') {
      this.setState({didRenderLoading: true})
      return this.fetchCitySentences(cityName)

    } else {this.setState({didRenderSentences: false})}
  }

  handleAbout = () => {
    handleApiResponse(fetch(`/api/aboutCity?cityName=${this.state.cityName}`))
    .then(cityCountryData => {
      this.setState({
        cityCountryData,
        isAboutClick: !this.state.isAboutClick
      })
    })
  }

  handleOnClickSentence = (index, cityName) => {
    this.setState({didRenderSentences: false, cityName})
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
            value={this.state.cityName}
            onChange={this.onInputChange}
            autoComplete='off'
            required
          />
          <label htmlFor='cityName' className='cityNameLabel'>Enter your city here</label>
          <button
            className='headerButton'
            id='search'
            onClick={() => this.props.handleSearchButton(this.state.cityName)}
          >Search</button>
          {this.state.didRenderLoading
            ? <FontAwesomeIcon icon={faSpinner} spin id='loadingIcon'/>
            : null
          }


          {this.state.isAboutClick
            ? <div className='aboutContainer' id='aboutCityArea'>
                <div className='infoContainer' id='infoContainer'>
                  <InfoContainer
                    cityInfo={this.state.cityCountryData}
                    onClickClose={this.handleCloseButton}
                  />
                </div>
              </div>
           : null}

          {this.state.didRenderSentences
            ? <ErrorBoundarySentences>
                <CitySentences
                  willUnmount={this.citySentencesWillUnmount}
                  cityCountry={this.state.citySentences}
                  onClick={this.handleOnClickSentence}
                />
              </ErrorBoundarySentences>
            : null}
        </div>
      </header>
    )
  }
}
