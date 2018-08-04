const express = require('express')
const album = require('../repo/album')

module.exports = ({db}) => {
    let api = express.Router()

    const repoAlbum = album(db)

    /**
     * Api /catalogs
     */
    api.get('/', async(req, res) => {
        try {
            const response = await repoAlbum.getAlbum(req)
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

    /**
     * Api /catalogs/id
     */
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

    /**
     * Api /catalogs/id/tracks
     */
    api.get('/:id/tracks', async(req, res) => {
        try {
            const response = await repoAlbum.getTrack(req, req.params.id)
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

    return api
}