
module.exports = (db) => {

    let module = {};

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
            if (mapFields[element]) {
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
        const whereClause = id ? `and id_label = '${id}'` : ``
        const customAttribute = 'group by id_label, label order by label'
        let response = await this.getBaseCatalog(requestFields, whereClause, customAttribute)
        
        if (id) {
            response.data = response.data.length ? response.data[0]: {}
        }
        
        return response
    }

    module.getAlbum = async function (id) {
        const sql = `select id_disc, disc, label, folder from music where agentcode = 'SOR' and id_label = ${id} group by id_disc, disc, label, folder`
    
        const result = await db.query(sql)
        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'albums',
              id: element.id_disc.toString(),
              attributes: {
                  name: element.disc,
                  catalog: element.label, 
                  url_coverart: element.folder
              }
          })  
        })
    
        const response = {
            "data": data
        }
    
        return response
    }

    return module
}
