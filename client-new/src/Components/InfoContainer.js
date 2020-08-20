import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faGlobe, faMapMarkedAlt, faWallet, faPhone, faLanguage, faTimes } from '@fortawesome/free-solid-svg-icons'

class InfoContainer extends Component {

  render() {
    const {country, city} = this.props.cityInfo

    return ([
      <InfoAboutCityString
        class='headingContainer' key='nameCountry'
        stringClass='headingName'
        value={`${city.name}, ${country.name} (${country.nameLocal})`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='population'
        icon={faUsers}
        headerClass='headingFat' headerValue='Population: '
        stringClass='infoText' value={`${city.population} peoples.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='region'
        icon={faGlobe}
        headerClass='headingFat' headerValue='Region: '
        stringClass='infoText' value={`${country.region}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='coordinates'
        icon={faMapMarkedAlt}
        headerClass='headingFat' headerValue='Coordinates: '
        stringClass='infoText' value={`${city.latitude}, ${city.longitude}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='currency'
        icon={faWallet}
        headerClass='headingFat' headerValue='Currency code: '
        stringClass='infoText' value={`${country.currencyCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='callingCode'
        icon={faPhone}
        headerClass='headingFat' headerValue='Country calling code: '
        stringClass='infoText' value={`${country.callingCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='language'
        icon={faLanguage}
        headerClass='headingFat' headerValue='Official language: '
        stringClass='infoText' value={`${country.languageName} (${country.languageNameLocal}).`}
      />,
      <CloseButton
        class='closeButtonContainer' key='closeButton'
        icon={faTimes}
        onClick={this.props.onClickClose}
      />,
    ])
  }
}

const InfoAboutCityString = props => {
  return (
    <div className={props.class}>
      {
        props.icon
          ? <FontAwesomeIcon icon={props.icon} size='lg' className='aboutIcon'/>
          : null
      } {
        props.headerClass
          ? <p className={props.headerClass}>{props.headerValue}</p>
          : null
      } {
        props.stringClass
          ? <p className={props.stringClass}>{props.value}</p>
          : null
      }
    </div>
  )
}

const CloseButton = props => {
  return (
    <div className={props.class}>
      <FontAwesomeIcon icon={props.icon} size='lg' onClick={props.onClick}/>
    </div>
  )
}

export default InfoContainer
