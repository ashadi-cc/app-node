const express = require('express')
const catalog = require('../repo/catalog')

module.exports = ({db}) => {
    let api = express.Router()

    const catalogRepo = catalog(db)
    
    api.get('/', async(req, res) => {
        try {
            const response = await catalogRepo.getCatalog(req)
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
            const response = await catalogRepo.getCatalog(req, req.params.id)
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


    api.get('/:id/albums', async(req, res) => {
        try {
            const response = await catalogRepo.getAlbum(req, req.params.id)
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