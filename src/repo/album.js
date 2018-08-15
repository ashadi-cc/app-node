
const Path = require('path')
const Track = require('./track')
const Util = require('./util')
const JsonApiQueryParser = require('jsonapi-query-parser')

module.exports = (db) => {

    const trackRepo = Track(db)

    const utilDB = Util(db)

    const jsonApiParser = new JsonApiQueryParser()

    let module = {}

    const mapFields = {
        "id": "id_disc",
        "name": "disc",
        "catalog": "label",
        "url_coverart": "folder"
    }

    const defaultField = 'name,catalog,url_coverart'

    const mainWhere = `agentcode = 'SOR'`

    // mapping field function
    const mappingField = (fields, record) => {

        let folder = record.folder.toString().replace(':', '/')
        folder = Path.dirname(folder)

        record.folder = `https://netmixeur.${folder}/coverart.jpg`
        
        let rec = {
            id: record[mapFields.id].toString(),
            type: 'albums',
            attributes: {}
        }

        fields.forEach(element => {
            if (mapFields.hasOwnProperty(element)) {
                rec.attributes[element] = record[mapFields[element]]
            }
        })

        return rec
    }

    module.mapFields = mapFields

    module.getBaseQueryAlbum = async function(requestFields, whereClause, start, limit) {
        const fields = Object.values(mapFields).join(',')

        let limitString = ''; 

        if (limit) {
            limitString = `limit ${start}, ${limit}`
        }

        const sql = `select ${fields} from music where ${mainWhere} ${whereClause} group by ${fields} order by disc ${limitString}`
        
        const albumResult = await db.query(sql)

        requestFields = requestFields ? requestFields : defaultField
        let arrayqueryField = requestFields.toString().toLowerCase().split(',')
        arrayqueryField = arrayqueryField.filter(e => e !== 'id')

        let data = []
        let item;

        albumResult.forEach(element => {
            item = mappingField(arrayqueryField, element)
            data.push(item)
        })

        let response = {
            "data": data
        }

        if (limit) {
            response.links = await utilDB.getLinks(start, limit, 'music', `${mainWhere} ${whereClause}`, fields)
        }
    
        return response
    }
    
    const includeTrack = async (idDisk, requestTrackFields) => {
        const whereClause = `id_disc = '${idDisk}' and mainversion = 1`
        const response = await trackRepo.getBaseQueryTrack(requestTrackFields, whereClause)

        let relationship = { tracks: { data : [] } }
        let included = [];

        response.data.forEach(element => {
            relationship.tracks.data.push({
                "id" : element.id, 
                "type" : element.type
            })

            included.push(element)
        })

        return { relationship, included}
    }
    
    module.getAlbum = async function (req, id) {
        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData
        
        //request fields
        const requestFields = fields.hasOwnProperty('albums') ? fields.albums.join(',') : ''
        let whereClause = id ? `and id_disc = '${id}'` : ``

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and disc like '%${q}%'`
        }

        if (id == undefined) {
            const {filter} = req.query
            if (filter) {
                const filterQuery = await utilDB.formatFilter(mapFields, filter)
                whereClause += ` and (${filterQuery})`
            }
        }

        let {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        if (id) limit = 0

        let response = await this.getBaseQueryAlbum(requestFields, whereClause, offset, limit)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
            const {include} = req.query
            if (include && (include == 'tracks')) {
                let requestTrackFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : 'title'
                if (requestTrackFields.trim() == '') requestTrackFields = 'title'
                const { relationship, included} = await includeTrack(id, requestTrackFields)

                response.data.relationship = relationship
                response.included = included
            }

        } else {
            response.links = await utilDB.formatLinks(req, response.links)
        }
        
        return response
    }
    
    module.getTrack = async function (req, id) {

        const requestData = jsonApiParser.parseRequest(req.url)
        const {fields} = requestData.queryData

        const requestFields = fields.hasOwnProperty('tracks') ? fields.tracks.join(',') : ''
        let whereClause = `id_disc = '${id}' and mainversion = 1`

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(trackRepo.mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }

        let {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await trackRepo.getBaseQueryTrack(requestFields, whereClause, offset, limit)
    
        response.links = await utilDB.formatLinks(req, response.links)
        
        return response
    }

    return module
}


