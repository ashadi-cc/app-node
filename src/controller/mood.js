const express = require('express')
const mood = require('../repo/mood')

module.exports = ({db}) => {
    let api = express.Router()
    const moodRepo = mood(db)

    api.get('/', async(req, res) => {
        try {
            const response = await moodRepo.getMood()
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