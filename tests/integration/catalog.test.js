const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))
require('dotenv').config()

describe('## Catalogs API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/catalogs', () => {
        it('should return 200 and response data greater than 0', async () => {
            const res = await request.get('/api/catalogs').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/catalogs?q=beat', () => {
            it('should return beat data', async() => {
                const res = await request.get('/api/catalogs?q=beat').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })
    })

    describe('# GET /api/catalogs/53546', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Object)
        })
    })

    describe('# GET /api/catalogs/53546/albums', () => {
        
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546/albums').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('#GET /api/catalogs/53546/albums?fields=name', () => {
            it('should return name in attributes', async () => {
                const res = await request.get('/api/catalogs/53546/albums?fields[albums]=name').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('name')
            })
        })

        describe('#GET /api/catalogs/53546/albums?q=green', () => {
            it('should return green data', async () => {
                const res = await request.get('/api/catalogs/53546/albums?q=green').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })

    })
})