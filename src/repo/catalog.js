
const Album = require('./album')
const Util = require('./util')

module.exports = (db) => {

    let module = {};

    const utilDB = Util(db)

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

    module.getBaseCatalog = async function(requestFields, whereClause, customAttribute, start, limit) {
        requestFields = requestFields ? requestFields : defaultField

        let arrayqueryField = requestFields.toString().toLowerCase().split(',')
        arrayqueryField = arrayqueryField.filter(e => e !== 'id')

        const fields = Object.values(mapFields).join(',')
        let limitString = ''; 

        if (limit) {
            limitString = `limit ${start}, ${limit}`
        }

        const sql = `select ${fields} from music where ${mainWhere} ${whereClause} ${customAttribute} ${limitString}`
        const catalogResult = await db.query(sql)

        let data = [], item
        catalogResult.forEach(element => {
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

    module.getCatalog = async function (req, id) {
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''
        let whereClause = id ? `and id_label = '${id}'` : ``
        const customAttribute = 'group by id_label, label order by label'

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and label like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }

        let {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        if (id) limit = 0

        let response = await this.getBaseCatalog(requestFields, whereClause, customAttribute, offset, limit)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
        } else {
            response.links = await utilDB.formatLinks(req, response.links)
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

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(albumRepo.mapFields, filter)
            whereClause += ` and (${filterQuery})`
        }

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        let response = await albumRepo.getBaseQueryAlbum(requestFields, whereClause, offset, limit)
        
        response.links = await utilDB.formatLinks(req, response.links)

        return response
    }

    return module
}
