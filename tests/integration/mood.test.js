const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))
require('dotenv').config()

describe('## Moods API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/moods', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/moods').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/moods?q=aggressive', () => {
            it('should return aggressive data', async () => {
                const res = await request.get('/api/moods?q=aggressive').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })
    })
})