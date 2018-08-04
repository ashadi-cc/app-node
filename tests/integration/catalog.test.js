const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Catalogs API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/catalogs', () => {
        it('should return 200 and response data greater than 0', async () => {
            const res = await request.get('/api/catalogs')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/catalogs?q=beat', () => {
            it('should return beat data', async() => {
                const res = await request.get('/api/catalogs?q=beat')
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })
    })

    describe('# GET /api/catalogs/53546', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Object)
        })
    })

    describe('# GET /api/catalogs/53546/albums', () => {
        
        it('should return 200', async () => {
            const res = await request.get('/api/catalogs/53546/albums')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('#GET /api/catalogs/53546/albums?fields=name', () => {
            it('should return name in attributes', async () => {
                const res = await request.get('/api/catalogs/53546/albums?fields=name')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('name')
            })
        })

        describe('#GET /api/catalogs/53546/albums?q=green', () => {
            it('should return green data', async () => {
                const res = await request.get('/api/catalogs/53546/albums?q=green')
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })

    })
})