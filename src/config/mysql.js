module.exports = {
    connectionLimit: 10,
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    user: process.env.DB_USER ? process.env.DB_USER : '',
    password: process.env.DB_PASS ? process.env.DB_PASS : '',
    database: process.env.DB_NAME ? process.env.DB_NAME :'cnd'
}