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

// connection.query('DROP TABLE weathers')

connection.query(sql)
  .then(result => console.log("Table created"))
  .catch(err => console.error(err.message))

// connection.query(sqlScheme, weatherData)
//   .then(([row, ]) => console.log('Data added'))
//   .catch(err => console.error('Ошибка: ' + err.message))
//
connection.query("SELECT * FROM weathers")
  .then(([rows, ]) => console.log(rows)) //2-d - fields
  .catch(err => console.error(err))

module.exports = connection
