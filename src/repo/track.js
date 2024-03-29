const Path = require('path')
const Util = require('./util')
const JsonApiQueryParser = require('jsonapi-query-parser')


module.exports = (db) => {

    let module = {}

    const utilDB = Util(db)

    const jsonApiParser = new JsonApiQueryParser()

    //mapping fields json => db
    const mapFields = {
        "id": "recid",
        "agent": "agent",
        "catalog": "label",
        "album": "disc",
        "title": "title",
        "track": "track",
        "description": "description",
        "moods": "moods",
        "genre": "music_styles",
        "path": "path",
        "duration": "duration",
        "tempobpm": "tempobpm",
        "trackversion": "trackversion",
        "url_audio": "path",
        "url_coverart": "path",
        "url_waveform": "path"
    }

    //default display fields
    const defaultField = 'catalog,album,title,track,moods,genre,tempobpm,trackversion,description,duration,path,url_audio,url_coverart,url_waveform'

    //default where clause
    const mainWhere = `and agentcode = 'SOR'`

    // mapping field function
    const mappingField = (fields, record) => {
        let rec = {
            id: record[mapFields.id].toString(),
            type: 'tracks',
            attributes: {}
        }

        //set url attributes
        let path,folder;
        path = record.path.toString().replace(':', '/')
        //filename = Path.basename(path)
        folder = Path.dirname(path)
        record.url_audio = encodeURI('https://netmixeur.' + path.replace('.wav', '.mp3'))
        record.url_coverart = encodeURI('https://netmixeur.' + folder + '/coverart.jpg')
        record.url_waveform = encodeURI('https://netmixeur.' + path.replace('/AudioFiles/', '/AudioFiles/waveforms/').replace('.wav', '.svg'))
        
        let cloneMapFields = Object.assign({}, mapFields)
        cloneMapFields.url_audio = 'url_audio'
        cloneMapFields.url_coverart = 'url_coverart'
        cloneMapFields.url_waveform = 'url_waveform'

        fields.forEach(element => {
            if (cloneMapFields.hasOwnProperty(element)) {
                rec.attributes[element] = record[cloneMapFields[element]]
            }
        })

        return rec
    }

    module.mapFields = mapFields

    module.getBaseQueryTrack = async function(requestFields, whereClause, start, limit) {
        let fields = Object.values(mapFields)
        fields = [...new Set(fields)].join(',')

        let limitString = ''; 

        if (limit) {
            limitString = `limit ${start}, ${limit}`
        }

        //removed main version = 1 when duration is set 
        if (whereClause.match(/\bduration\b/g)) {
            let el, duration;
            whereClause.split(' ').forEach(element => {
                el = element.replace(/\(/g, '').trim();
                if (el == 'duration') {
                    duration = true;
                }
            });
            if (duration === true) {
                whereClause = whereClause.replace(/mainversion = 1/i, '1 = 1');
            }
        }
        const sql = `select ${fields} from music where ${whereClause} ${mainWhere} ${limitString}`
        const musicResult = await db.query(sql)

        let data = []
        let item;

        requestFields = requestFields ? requestFields : defaultField

        let arrayqueryField = requestFields.toString().toLowerCase().split(',')
        //remove id
        arrayqueryField = arrayqueryField.filter(e => e !== 'id')
        arrayqueryField = arrayqueryField.filter(e => e !== 'path')

        musicResult.forEach(element => {
            item = mappingField(arrayqueryField, element)
            data.push(item)
        })

        let response = {
            "data": data
        }

        if (limit) {
            response.links =  await utilDB.getLinks(start, limit, 'music', `${whereClause} ${mainWhere}`)
        }
    
        return response
    }
    
    module.getTrack = async function (req) {
        let whereClause = `mainversion = 1`
        
        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }

        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData
        //request fields
        const requestFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : ''

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await this.getBaseQueryTrack(requestFields, whereClause, offset, limit)

        if (response.hasOwnProperty('links')) {
            response.links = await utilDB.formatLinks(req, response.links)
        }

        return response
    }

    module.getTrackById = async function (id, req) {
        let whereClause = `recid = '${id}'`

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData
        //request fields
        const requestFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : ''

        let response = await this.getBaseQueryTrack(requestFields, whereClause)

        response.data = response.data.length ? response.data[0] : {}

        return response
    }
    
    module.getAlternate = async function (id, req) {
        let sql = `select trackspertitle, id_disc from music where recid = ${id}`
        let result = await db.query(sql)
    
        if (!result.length) return {"data": []}

        const rec = result[0]
        let whereClause = `trackspertitle = '${rec.trackspertitle}' and id_disc = ${rec.id_disc} and recid <> ${id}`

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }

        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData
        //request fields
        const requestFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : ''

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await this.getBaseQueryTrack(requestFields, whereClause, offset, limit)

        if (response.hasOwnProperty('links')) {
            response.links = await utilDB.formatLinks(req, response.links)
        }

        return response
    }


    return module
}


