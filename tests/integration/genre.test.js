const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))
require('dotenv').config()

describe('## Genre API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/genre', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/genre').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('#GET /api/genre?q=anthems', () => {
            it('should return anthems data', async() => {
                const res = await request.get('/api/genre?q=anthems').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })
    })
})