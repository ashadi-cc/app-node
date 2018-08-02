
module.exports = (db) => {

    let module = {};

    module.getCatalog = async function (id) {
        let where = ''
        if (id) {
            where = `AND id_label = ${id}`
        }
    
        const sql = `Select id_label, label from music Where  agentcode = 'SOR' ${where} group by id_label, label order by label`
        const result = await db.query(sql)
        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'catalogs',
              id: element.id_label.toString(),
              attributes: {
                  name: element.label
              }
          })  
        })
    
        if (id) {
            data = data.length ? data[0] : {}
        }
    
        const response = {
            "data": data
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
