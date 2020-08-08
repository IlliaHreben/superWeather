const Sequelize = require('sequelize')

const {sqlPassword, host} = require('./config')


const sequelize = new Sequelize('superweather', 'superweather', sqlPassword, {
  dialect: 'mysql',
  host,
  charset: 'utf8'
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
  iconId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  iconPhrase: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cityId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  countryId: {
    type: Sequelize.INTEGER,
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
            fields: ['cityId', 'source']
        }
    ]
})

const Cities = sequelize.define('cities', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  index: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  population: {
    type: Sequelize.INTEGER,
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
  countryId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
    indexes: [
        {
            unique: true,
            fields: ['index']
        }
    ]
})

const Forecasts = sequelize.define('forecasts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  temperatureMin: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  temperatureMax: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  iconId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  iconPhrase: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cityId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  weatherId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

const Countries = sequelize.define('countries', {
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
  nameLocal: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  },
  region: {
    type: Sequelize.STRING,
    allowNull: false
  },
  currencyCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  languageName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  languageNameLocal: {
    type: Sequelize.STRING,
    allowNull: false
  },
  callingCode: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
})

Cities.hasMany(Weathers, {onDelete: 'cascade'})
Weathers.belongsTo(Cities, {onDelete: 'cascade'})
Weathers.hasMany(Forecasts, {onDelete: 'cascade'})
Cities.hasMany(Forecasts, {onDelete: 'cascade'})
Forecasts.belongsTo(Cities, {onDelete: 'cascade'})

Weathers.belongsTo(Countries, {onDelete: 'cascade'})
Countries.hasMany(Cities, {onDelete: 'cascade'})
Cities.belongsTo(Countries, {onDelete: 'cascade'})

sequelize.sync({force: true})
  .then(() => {
    console.log('Sucessfuly sync.')
  })
  .catch(err => console.log('ERROR!!! ' + err.message))


module.exports = {Countries, Cities, Weathers, Forecasts}
