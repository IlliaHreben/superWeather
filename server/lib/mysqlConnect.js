const Sequelize = require('sequelize')

const {sqlPassword, host} = require('./config')

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
  temperature: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  cityId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

const Cities = sequelize.define('cities', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
    indexes: [
        {
            unique: true,
            fields: ['name', 'source']
        }
    ]
})
Cities.hasMany(Weathers, {onDelete: 'cascade'})
Weathers.belongsTo(Cities, {onDelete: 'cascade'})

sequelize.sync({force: true})
  .then(() => {
    console.log('Sucessfuly sync.')
  })
  .catch(err => console.log('ERROR!!!' + err.message))

const addWeatherToDB = (cityData, weatherData) => {
  return Cities.upsert(cityData)
    .then(([city]) => {
      return Weathers.create({
        ...weatherData,
        cityId: city.id
      })
        .then(weather => {
          console.log(`Sucessfuly added.`)
          return {city, weather}
        })
    })
}

const takeHistoryWeatherRequests = name => {
  return Weathers.findAll({include: {
    model: Cities,
    where: {name}
  }})
}

const getAboutCity = name => {
  return Cities.findAll({
    where: {name},
    raw: true
  })
}

module.exports = {Weathers, addWeatherToDB, takeHistoryWeatherRequests, getAboutCity}
