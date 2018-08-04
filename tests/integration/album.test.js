const request = require('supertest')('http://localhost:' + ((process.env.NODE_PORT) ? process.env.NODE_PORT : 3000))

describe('## Albums API', () => {
    
    beforeAll(async () => {
        
    })

    afterAll(async () => {

    })

    afterEach(async () => {

    })

    describe('# GET /api/albums', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/albums/?q=adrenaline', () => {
            it('should return data', async () => {
                const res = await request.get('/api/albums/?q=adrenaline')
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })

        describe('# GET /api/albums/?fields=name', () => {
            it('should return name in attributes', async () => {
                const res = await request.get('/api/albums/?fields=name')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('name')
            })
        })


    })

    describe('# GET /api/albums/4251549', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums/4251549')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Object)
        })

        describe('# GET /api/albums/4251549/?fields=name', () => {
            it('should return name in attributes', async () => {
                const res = await request.get('/api/albums/4251549/?fields=name')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data.attributes).join(',')).toBe('name')
            })
        })

    })

    describe('# GET /api/albums/4251549/tracks', () => {
        it('should return 200', async () => {
            const res = await request.get('/api/albums/4251549/tracks')
            expect(res.status).toBe(200)
            expect(res.body.data).toBeInstanceOf(Array)
        })

        describe('# GET /api/albums/4251549/tracks?q=banging', () => {
            it('should return data', async () => {
                const res = await request.get('/api/albums/4251549/tracks?q=banging')
                expect(res.status).toBe(200)
                expect(res.body.data.length).toBeGreaterThan(0)
            })
        })

        describe('# GET /api/albums/4251549/tracks?fields=album', () => {
            it('should return album in attributes', async () => {
                const res = await request.get('/api/albums/4251549/tracks?fields=album')
                expect(res.status).toBe(200)
                expect(Object.keys(res.body.data[0].attributes).join(',')).toBe('album')
            })
        })
    })
})