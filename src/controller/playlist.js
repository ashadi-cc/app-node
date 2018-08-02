const express = require('express')
const playlist = require('../repo/playlist')

module.exports = ({db}) => {
    let api = express.Router()
    
    const playlistRepo = playlist(db)

    api.get('/', async(req, res) => {
        try {
            const response = await playlistRepo.getPlaylist()
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
            const response = await playlistRepo.getPlaylist(req.params.id)
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