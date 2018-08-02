const express = require('express')
const db = require ('../db')
const catalog = require ('../controller/catalog')
const album = require ('../controller/album')
const track = require ('../controller/track')
const playlist = require ('../controller/playlist')
const genre = require ('../controller/genre')
const mood = require ('../controller/mood')

let router = express();

router.use('/catalogs', catalog({db}))
router.use('/albums', album({db}))
router.use('/tracks', track({db}))
router.use('/playlists', playlist({db}))
router.use('/genre', genre({db}))
router.use('/moods', mood({db}))

module.exports = router