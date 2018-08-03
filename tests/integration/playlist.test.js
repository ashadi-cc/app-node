const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Playlists API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/playlists', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/playlists')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/playlists/156', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/playlists/156')
            expect(res.status).toBe(200)
        })
    })
})