const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Genre API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/genre', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/genre')
            expect(res.status).toBe(200)
        })
    })
})