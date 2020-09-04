import React, {Component} from 'react'

import {handleApiResponse} from '../App.js'
import contamination from '../pictures/contamination.svg'
import trash from '../pictures/trash.svg'

export default class AirQuality extends Component {
  state = {
    sourcesData: ''
  }


  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.fetchAirQuailty(this.props.keyRequest, this.props.nameOrIndex)
    }
  }

  componentDidMount() {
    this.fetchAirQuailty(this.props.keyRequest, this.props.nameOrIndex)
  }

  fetchAirQuailty = async (key, value) => {
    try {
      const sourcesData = await Promise.all(
        [
          'waqi',
          'iqair',
          'breezo'
        ].map(sourceName => handleApiResponse(fetch(`/api/${sourceName}?${key}=${value}`)) )
      )
      this.setState({sourcesData})
    } catch (err) {
      console.log(err)
    }
  }

  render () {
    const sourcesData = this.state.sourcesData
    return (
      <div className='mainContainer'>

        <div className='mainContainerHeader'>
          <h1 className='headerText'>AIR QUALITY</h1>
        </div>

        <div className='mainContainerContent airQualityContainer'>
          {sourcesData && sourcesData.map(sourceData =>
            <QualityBlock {...sourceData}/>
          )}
        </div>

      </div>
    )
  }
}

const QualityBlock = props => {

  return (
    <div className='qualityBlock'>
      <p className='pollutorSource'>{props.source}</p>
      <div className='pollutorContainer'>
        <Pollutor description='AQI' value={props.aqi} path={contamination}/>
        <Pollutor description='Main pollutor' value={props.mainPollutor} path={trash} />
      </div>
    </div>
  )
}

const Pollutor = props => {
  return (
    <div className='pollutor'>
      <img src={props.path} alt='pollutor'/>
      <p className='pollutorDescription'>{props.description}</p>
      <p className='pollutorValue'>{props.value}</p>
    </div>
  )
}
