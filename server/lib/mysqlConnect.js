const mysql = require('mysql2')
const Sequelize = require('sequelize')

const {sqlPassword, host} = ('./config')

const sequelize = new Sequelize('superweather', 'superweather', sqlPassword, {
  dialect: 'mysql',
  host
})

const Weathers = sequelize.define('weathers', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  temp: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

sequelize.sync()
  .then(() => {
    console.log('Sucessfuly sync.')
  })
  .catch(err => console.log(err))

const addDataToDB = (cityName, tempValue, source) => {
  Weathers.create({
    city: cityName,
    temp: tempValue,
    source
  })
    .then((res) => console.log(`Sucessfuly added. Info about row: ${res.city}: ${res.temp}. ${source}`))
    .catch(err => console.error('Error: ' + err.message))
}

const takeHistoryWeatherRequests = cityName => {
  return Weathers.findAll({ where:{city: cityName}, raw: true })
}

module.exports = {Weathers, addDataToDB, takeHistoryWeatherRequests}
