const express = require('express')
const genre = require('../repo/genre')

module.exports = ({db}) => {
    let api = express.Router()
    
    const genreRepo = genre(db)

    api.get('/', async(req, res) => {
        try {
            const response = await genreRepo.getGenre()
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