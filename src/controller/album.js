const express = require('express')
const album = require('../repo/album')

module.exports = ({db}) => {
    let api = express.Router()

    const repoAlbum = album(db)

    api.get('/', async(req, res) => {
        try {
            const response = await repoAlbum.getAlbum(req)
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

    api.get('/:id', async(req, res) => {
        try {
            const response = await repoAlbum.getAlbum(req, req.params.id)
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


    api.get('/:id/tracks', async(req, res) => {
        try {
            const response = await repoAlbum.getTrack(req, req.params.id)
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