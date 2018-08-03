const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Albums API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/albums', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/albums/4251549', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums/4251549')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/albums/4251549/tracks', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums/4251549')
            expect(res.status).toBe(200)
        })
    })
})