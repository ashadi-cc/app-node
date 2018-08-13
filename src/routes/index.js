const express = require('express')
const db = require ('../db')
const catalog = require ('../controller/catalog')
const album = require ('../controller/album')
const track = require ('../controller/track')
const playlist = require ('../controller/playlist')
const genre = require ('../controller/genre')
const mood = require ('../controller/mood')

let router = express();

router.enable('trust proxy', true)

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.header('Content-Type', 'application/vnd.api+json')

    const api_key = req.headers['api-key'] ? req.headers['api-key']: ''

    if (process.env.API_KEY !== api_key) {
        res.status(401).send({
            status: 401,
            statusText: 'Unauthorized'
        })

        return;
    }

    if ('OPTIONS' == req.method) {
        res.status(200).send('')
    } else {
        next()
    }
})

router.use('/catalogs', catalog({db}))
router.use('/albums', album({db}))
router.use('/tracks', track({db}))
router.use('/playlists', playlist({db}))
router.use('/genre', genre({db}))
router.use('/moods', mood({db}))

//404 not found
router.use((req, res, next) =>  {
    res.status(404).send({
        status: 404,
        statusText: 'route not found',
        errors: []
    })
})

module.exports = router