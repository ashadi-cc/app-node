const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))
require('dotenv').config()

describe('## Playlists API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/playlists', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/playlists').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/playlists?fields[playlists]=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/playlists?fields[playlists]=title').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('title')
            })
        })

        describe('# GET /api/playlists?q=glitter', () => {
            it('should return glitter data', async () => {
                const res = await request.get('/api/playlists?q=glitter').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })

    })

    describe('# GET /api/playlists/156', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/playlists/156').set('api-key', process.env.API_KEY)
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/playlists/156?fields[tracks]=title', () => {
            it('should return title in attributes', async () => {
                const res = await request.get('/api/playlists/156?fields[tracks]=title').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join('')).toBe('title')
            })
        })

        describe('# GET /api/playlists/156?q=cinema', () => {
            it('should return data by query', async () => {
                const res = await request.get('/api/playlists/156?q=cinema').set('api-key', process.env.API_KEY)
                expect(res.status).toBe(200)
                expect(res.body.data).toBeInstanceOf(Array)
            })
        })
    })
})