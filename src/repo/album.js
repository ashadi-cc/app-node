
const Path = require('path')
const Track = require('./track')

module.exports = (db) => {

    const trackRepo = Track(db)

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

    module.getBaseQueryAlbum = async function(requestFields, whereClause) {
        const fields = Object.values(mapFields).join(',')
        const sql = `select ${fields} from music where ${mainWhere} ${whereClause} group by ${fields} order by disc`
        
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

        const response = {
            "data": data
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

        let response = await this.getBaseQueryAlbum(requestFields, whereClause)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
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

        const response = await trackRepo.getBaseQueryTrack(requestFields, whereClause)
    
        return response
    }

    return module
}


