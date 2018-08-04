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
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/moods?q=aggressive', () => {
            it('should return aggressive data', async () => {
                const res = await request.get('/api/moods?q=aggressive')
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })
    })
})