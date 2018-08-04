const express = require('express')
const track = require('../repo/track')

module.exports = ({db}) => {
    let api = express.Router()

    const trackRepo = track(db)

    api.get('/', async(req, res) => {
        try {
            const response = await trackRepo.getTrack(req)
            res.send(response)
        } catch (e) {
            console.error(e)
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                    e
                ]
            })
        }
    })

    api.get('/:id', async(req, res) => {
        try {
            const response = await trackRepo.getTrackById(req.params.id, req)
            res.send(response)
        } catch (e) {
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                    e
                ]
            })
        }
    })


    api.get('/:id/tracksalternate', async(req, res) => {
        try {
            const response = await trackRepo.getAlternate(req.params.id, req)
            res.send(response)
        } catch (e) {
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                    e
                ]
            })
        }
    })

    return api
}