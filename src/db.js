const mysql = require('mysql')
const util = require('util')
const config = require('./config/mysql')

let pool = mysql.createPool(config)

pool.query = util.promisify(pool.query)

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()

    return
})

module.exports = pool