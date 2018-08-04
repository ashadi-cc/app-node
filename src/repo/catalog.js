
const Album = require('./album')

module.exports = (db) => {

    let module = {};

    const albumRepo = Album(db)

    const mapFields = {
        "id": "id_label",
        "name": "label"
    }

    const defaultField = 'name'

    const mainWhere = `agentcode = 'SOR'`

    // mapping field function
    const mappingField = (fields, record) => {
        let rec = {
            id: record[mapFields.id].toString(),
            type: 'catalogs',
            attributes: {}
        }

        fields.forEach(element => {
            if (mapFields.hasOwnProperty(element)) {
                rec.attributes[element] = record[mapFields[element]]
            }
        })

        return rec
    }

    module.getBaseCatalog = async function(requestFields, whereClause, customAttribute) {
        requestFields = requestFields ? requestFields : defaultField

        let arrayqueryField = requestFields.toString().toLowerCase().split(',')
        arrayqueryField = arrayqueryField.filter(e => e !== 'id')

        const fields = Object.values(mapFields).join(',')
        const sql = `select ${fields} from music where ${mainWhere} ${whereClause} ${customAttribute}`
        const catalogResult = await db.query(sql)

        let data = [], item
        catalogResult.forEach(element => {
            item = mappingField(arrayqueryField, element)
            data.push(item)
        })

        const response = {
            "data": data
        }
    
        return response
    }

    module.getCatalog = async function (req, id) {
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''
        let whereClause = id ? `and id_label = '${id}'` : ``
        const customAttribute = 'group by id_label, label order by label'

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and label like '%${q}%'`
        }

        let response = await this.getBaseCatalog(requestFields, whereClause, customAttribute)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
        }
        
        return response
    }

    module.getAlbum = async function (req, id) {
        const requestFields = req.query.fields ? req.query.fields : ''
        let whereClause = `and id_label = '${id}'`

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and disc like '%${q}%'`
        }

        const response = await albumRepo.getBaseQueryAlbum(requestFields, whereClause)
    
        return response
    }

    return module
}
