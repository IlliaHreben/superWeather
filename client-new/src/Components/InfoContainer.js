import React, {Component} from 'react'

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
        iconClass='fas fa-users fa-lg'
        headerClass='headingFat' headerValue='Population: '
        stringClass='infoText' value={`${city.population} peoples.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='region'
        iconClass='fas fa-globe fa-lg'
        headerClass='headingFat' headerValue='Region: '
        stringClass='infoText' value={`${country.region}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='coordinates'
        iconClass='fas fa-map-marked-alt fa-lg'
        headerClass='headingFat' headerValue='Coordinates: '
        stringClass='infoText' value={`${city.latitude}, ${city.longitude}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='currency'
        iconClass='fas fa-wallet fa-lg'
        headerClass='headingFat' headerValue='Currency code: '
        stringClass='infoText' value={`${country.currencyCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='callingCode'
        iconClass='fas fa-phone fa-lg'
        headerClass='headingFat' headerValue='Country calling code: '
        stringClass='infoText' value={`${country.callingCode}.`}
      />,
      <InfoAboutCityString
        class='stringInfoContainer' key='language'
        iconClass='fas fa-language fa-lg'
        headerClass='headingFat' headerValue='Official language: '
        stringClass='infoText' value={`${country.languageName} (${country.languageNameLocal}).`}
      />,
      <CloseButton
        class='closeButtonContainer' key='closeButton'
        iconClass='fas fa-times fa-lg' iconKey='closeinfoButton'
        onClick={this.props.onClickClose}
      />,
    ])
  }
}

const InfoAboutCityString = props => {
  return (
    <div className={props.class}>
      {
        props.iconClass
          ? <i className={props.iconClass}/>
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
      <i className={props.iconClass} id={props.iconID} onClick={props.onClick}/>
    </div>
  )
}

export default InfoContainer
