const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Moods API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/moods', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/moods')
            expect(res.status).toBe(200)
        })
    })
})