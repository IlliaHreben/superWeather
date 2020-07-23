const mysql = require('mysql2')

const password = 'superweather' // move to config

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'superweather',
  database: 'superweather',
  password
}).promise()

const sql = "CREATE TABLE if not exists weathers (id INT AUTO_INCREMENT PRIMARY KEY, city VARCHAR(255), temp FLOAT, source VARCHAR(255), datetime TIMESTAMP)"

// connection.query('DROP TABLE weathers')

connection.query(sql)
  .then(() => console.log("Table created")) // (result)
  .catch(err => console.error(err.message))

const addDataToDB = (cityName, tempValue, source) => {
  const sqlAddString = 'INSERT INTO weathers(city, temp, source, datetime) VALUES(?, ?, ?, ?)'
  connection.query(sqlAddString, [cityName, tempValue, source, new Date()])
    .then(([row, ]) => console.log(row[0]))
    .catch(err => console.error('Error: ' + err.message))
}

const takeHistoryWeatherRequests = cityName => {
  const sqlTakeHistoryWeatherRequests = `SELECT * FROM weathers WHERE city=?`
  return connection.query(sqlTakeHistoryWeatherRequests, cityName)
}

module.exports = {connection, addDataToDB, takeHistoryWeatherRequests}
