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
      this.fetchAirQuailty(this.props.keyRequest, this.props.desiredValue)
    }
  }

  componentDidMount() {
    this.fetchAirQuailty(this.props.keyRequest, this.props.desiredValue)
  }

  fetchAirQuailty = async (key, value) => {
    try {
      const sourcesData = await Promise.all(
        [
          'waqi',
          'iqair'
        ].map(sourceName => handleApiResponse(fetch(`/api/${sourceName}?${key}=${value}`)) )
      )

      this.setState({sourcesData})
    } catch (err) {
      console.log(err)
    }
  }

  render () {

    return (
      <div className='mainContainer'>

        <div className='mainContainerHeader'>
          <h1 className='headerText'>AIR QUALITY</h1>
        </div>

        <div className='mainContainerContent'>
          {this.state.sourcesData && this.state.sourcesData.map(sourceData => <QualityBlock {...sourceData}/>)}
        </div>

      </div>
    )
  }
}

const QualityBlock = props => {

  return (
    <div className='qualityBlock'>
      <p>{props.source}</p>
      <Pollutor description='AQI' value={props.aqi} path={contamination}/>
      <Pollutor description='Main pollutor' value={props.mainPollutor} path={trash} />
    </div>
  )
}

const Pollutor = props => {
  return (
    <div className='pollutor'>
      <img src={props.path} alt='pollutor'/>
      <p>{props.description}</p>
      <p>{props.value}</p>
    </div>
  )
}
