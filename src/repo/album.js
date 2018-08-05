
const Path = require('path')
const Track = require('./track')
const Util = require('./util')

module.exports = (db) => {

    const trackRepo = Track(db)

    const utilDB = Util(db)

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
    
    module.getAlbum = async function (req, id) {
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''
        let whereClause = id ? `and id_disc = '${id}'` : ``

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and disc like '%${q}%'`
        }

        let {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        if (id) limit = 0

        let response = await this.getBaseQueryAlbum(requestFields, whereClause, offset, limit)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
        } else {
            response.links = await utilDB.formatLinks(req, response.links)
        }
        
        return response
    }
    
    module.getTrack = async function (req, id) {
        const requestFields = req.query.fields ? req.query.fields : ''
        let whereClause = `id_disc = '${id}' and mainversion = 1`

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }

        let {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await trackRepo.getBaseQueryTrack(requestFields, whereClause, offset, limit)
    
        response.links = await utilDB.formatLinks(req, response.links)
        
        return response
    }

    return module
}


