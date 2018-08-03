const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Catalogs API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/catalogs', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/catalogs/53546', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546')
            expect(res.status).toBe(200)
        })
    })

    describe('# GET /api/catalogs/53546/albums', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546/albums')
            expect(res.status).toBe(200)
        })
    })
})