const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))
require('dotenv').config()

describe('## Tracks API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/tracks', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/tracks?fields[tracks]=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks?fields[tracks]=title').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

        describe('# GET /api/tracks?q=cinema', () => {
            it('should return query data', async () => {
                const res = await request.get('/api/tracks/?q=cinema').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data).toBeInstanceOf(Array)
            })
        })

    })

    describe('# GET /api/tracks/3', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Object)
        })

        describe('# GET /api/tracks/3?fields[tracks]=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks/3?fields[tracks]=title').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data.attributes).join(',')).toBe('title')
            })
        })

    })


    describe('# GET /api/tracks/3/tracksalternate', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/tracks/3/tracksalternate').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/tracks/3/tracksalternate?fields[tracks]=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/tracks/3/tracksalternate?fields[tracks]=title').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

        describe('# GET /api/tracks/3/tracksalternate?q=cinema', () => {
            it('should return query data', async () => {
                const res = await request.get('/api/tracks/3/tracksalternate?q=cinema').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data).toBeInstanceOf(Array)
            })
        })

        describe('#GET /api/tracks/?filter=(title lk `track` and duration ge 180)', () => {
            it('should return 200', async () => {
                const res = await request.get('/api/tracks/?filter=(title lk `track` and duration ge 180)').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
            })
        })

    })
})