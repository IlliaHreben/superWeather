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

Cities.hasMany(Weathers, {onDelete: 'cascade'})
Weathers.belongsTo(Cities, {onDelete: 'cascade'})
Weathers.hasMany(Forecasts, {onDelete: 'cascade'})
Cities.hasMany(Forecasts, {onDelete: 'cascade'})
// Forecasts.belongsTo(Cities, {onDelete: 'cascade'})

sequelize.sync({force: true})
  .then(() => {
    console.log('Sucessfuly sync.')
  })
  .catch(err => console.log('ERROR!!! ' + err.message))


module.exports = {Weathers, Cities, Forecasts}
