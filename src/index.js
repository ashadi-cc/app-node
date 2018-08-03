const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.NODE_PORT ? process.env.NODE_PORT : 3000

app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

module.exports = app