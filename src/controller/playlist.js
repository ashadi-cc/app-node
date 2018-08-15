const express = require('express')
const playlist = require('../repo/playlist')

module.exports = ({db}) => {
    let api = express.Router()
    
    const playlistRepo = playlist(db)

    api.get('/', async(req, res) => {
        try {
            const response = await playlistRepo.getPlaylist(req)
            res.send(response)
        } catch (e) {
            console.error(e)
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                ]
            })
        }
    })

    api.get('/:id', async(req, res) => {
        try {
            const response = await playlistRepo.getPlaylist(req)
            res.send(response)
        } catch (e) {
            console.error(e)
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                ]
            })
        }
    })

    api.get('/:id/tracks', async(req, res) => {
        try {
            const response = await playlistRepo.getById(req.params.id, req)
            res.send(response)
        } catch (e) {
            console.error(e)
            res.status(500).send({
                status: 500,
                statusText: 'Something went wrong',
                errors: [
                ]
            })
        }
    })

    return api
}