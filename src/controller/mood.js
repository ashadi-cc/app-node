const express = require('express')
const mood = require('../repo/mood')

module.exports = ({db}) => {
    let api = express.Router()
    const moodRepo = mood(db)

    api.get('/', async(req, res) => {
        try {
            const response = await moodRepo.getMood(req)
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