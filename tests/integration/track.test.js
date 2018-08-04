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
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/tracks?fields=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks?fields=title')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

        describe('# GET /api/tracks?q=cinema', () => {
            it('should return query data', async () => {
                const res = await request.get('/api/tracks/q?fields=cinema')
                expect(res.status).toBe(200)
                expect(res.body.data).toBeInstanceOf(Array)
            })
        })

    })

    describe('# GET /api/tracks/3', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Object)
        })

        describe('# GET /api/tracks/3?fields=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks/3?fields=title')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

    })


    describe('# GET /api/tracks/3/tracksalternate', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3/tracksalternate')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/tracks/3/tracksalternate?fields=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks/3/tracksalternate?fields=title')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

        describe('# GET /api/tracks/3/tracksalternate?q=cinema', () => {
            it('should return query data', async () => {
                const res = await request.get('/api/tracks/3/tracksalternate?fields=cinema')
                expect(res.status).toBe(200)
                expect(res.body.data).toBeInstanceOf(Array)
            })
        })

    })
})