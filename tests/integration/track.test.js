const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Tracks API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/tracks', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/tracks/3', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3')
            expect(res.status).toBe(200)
        })
    })


    describe('# GET /api/tracks/3/tracksalternate', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3/tracksalternate')
            expect(res.status).toBe(200)
        })
    })
})