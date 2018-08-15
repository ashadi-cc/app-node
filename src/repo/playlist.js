const Track = require('./track')
const Util = require('./util')
const JsonApiQueryParser = require('jsonapi-query-parser')

module.exports = (db) => {
    
    let module = {}

    const utilDB = Util(db)
    
    const TrackRepo = Track(db)

    const jsonApiParser = new JsonApiQueryParser()

    //map fields json => db
    const mapFields = {
        "id": "id",
        "title": "title",
        "description": "description",
        "url_image": "imagepath"
    }

    //default display fields
    const defaultField = 'title,description,url_image'

    //get all playlist
    module.getPlaylist = async function (req) {
        const requestData = jsonApiParser.parseRequest(req.url)
        const fieldsRequest = requestData.queryData.fields
        const playListId = req.params.id

        //request fields
        const requestFields =fieldsRequest.hasOwnProperty('playlists') ? fieldsRequest.playlists.join(',') : defaultField

        let arrayqueryField = requestFields.split(',')
        //remove id
        arrayqueryField = arrayqueryField.filter(e => e !== 'id');

        let where = `published = 1 AND publishdatestart <= CURDATE()  and CURDATE() <= publishdateend and action like 'spot%'`; 
        
        if (req.query.q) {
            const q = req.query.q
            where += ` and title like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(mapFields, filter)
            where += ` and (${filterQuery})`
        }

        if (playListId) {
            where += ` and id = '${playListId}'`
        }
        
        //limit and offset
        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        const fields = `id,title,description,concat('https://www.redbullaudiolibrary.com/',imagepath) as imagepath`
        const sql = `select ${fields} from _playlistbuttons WHERE  ${where} order by displayorder limit ${offset}, ${limit}`
        
        const result = await db.query(sql)
        let data = []
        let rec = {}

        result.forEach(element => {
            rec = {
                id: element[mapFields.id].toString(),
                type: 'playlists',
                attributes: {}                
            }

            arrayqueryField.forEach(el => {
                if (mapFields.hasOwnProperty(el)) {
                    rec.attributes[el] = element[mapFields[el]]
                }
            })

            data.push(rec) 
        })
    
        let response = {
            "data": data
        }
        
        if (playListId) {
            response.data = response.data.length ? response.data[0] : {}
        } else {
            let links = await utilDB.getLinks(offset, limit, '_playlistbuttons', where)
            links = await utilDB.formatLinks(req, links)

            response.links = links
        }
    
        return response    
    }

    module.getById = async function(id, req) {
        let sql = `select action from _playlistbuttons where id = ${id}`
        const result = await db.query(sql)

        if (!result.length) return {"data": []}

        const rec = result[0]
        let whereClause = ''

        if (rec.action != '') {
            let actionArr = rec.action.split(',')
            let playlistType = actionArr[0]
            let idSearch = actionArr[1]

            if (playlistType == 'spot') {
                whereClause = `recid in (select stableid from _pm_sound where id_spot = '${idSearch}')`
            }
        }

        if (whereClause == '') return {"data": []}

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(TrackRepo.mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }
        
        //request fields
        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData

        const requestFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : ''

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await TrackRepo.getBaseQueryTrack(requestFields, whereClause, offset, limit)

        response.links = await utilDB.formatLinks(req, response.links)
        
        return response
    }

    return module
}

