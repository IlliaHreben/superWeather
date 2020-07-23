const mysql = require('mysql2')

const password = 'superweather' // move to config

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'superweather',
  database: 'superweather',
  password
}).promise()

const sql = "CREATE TABLE weathers (id INT AUTO_INCREMENT PRIMARY KEY, city VARCHAR(255), temp FLOAT, source VARCHAR(255), datetime TIMESTAMP)"
// const sqlScheme = 'INSERT INTO weathers(city, temp, datetime) VALUES(?, ?, ?)'
// const weatherData = ['Kyiv', '28', new Date()]

connection.query('DROP TABLE weathers')

connection.query(sql)
  .then(result => console.log("Table created"))
  .catch(err => console.error(err.message))


connection.query("SELECT * FROM weathers")
  .then(([rows, ]) => console.log(rows)) //2-d - fields
  .catch(err => console.error(err.message))

const addDataToDB = (cityName, tempValue, source) => {
  const sqlScheme = 'INSERT INTO weathers(city, temp, source, datetime) VALUES(?, ?, ?, ?)'
  connection.query(sqlScheme, [cityName, tempValue, source, new Date()])
    .then(([row, ]) => console.log('Data added.' + row))
    .catch(err => console.error('Error: ' + err.message))
}

module.exports = {connection, addDataToDB}
