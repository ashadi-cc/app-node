require('dotenv').config()
const db = require ('../db')
const svg = require('./svg')(db)

console.log('starting converting audio file to svg')
svg.convert()

