import React, {Component} from 'react'

export class CitySentences extends Component {
  componentWillUnmount() {
    this.props.willUnmount()
  }
  render() {
    const cityCountryData = this.props.cityCountry
    const citySentencesStrings = cityCountryData.map(({country, city}) =>
      <div
        className='citySentenceContainer'
        key={city.index}
        onClick={() => {this.props.onClick(city.index, city.name)}}
      >
        <p className='cityNameSentence'>{`  ${city.name}, `}</p>
        <p className='countryNameSentence'>{country.name}</p>
        <p className='populationSentence'>{`${city.population} peoples`}</p>
      </div>
    )
    return (
      <div id='citySentences' key={'citySentences'}>
        {citySentencesStrings}
      </div>
    )
  }
}

export class ErrorBoundarySentences extends Component {
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
