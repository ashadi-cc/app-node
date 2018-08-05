const Util = require('./util')

module.exports = (db) => {
    let module = {}

    const utilDB = Util(db)

    const mapFields = {
        "name" : "theword"
    }
    
    module.getGenre = async function (req) {

        let where = `fieldname = 'music_styles'`

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}

        if (req.query.q) {
            const q = req.query.q
            where += ` and theword like '%${q}%'`
        }

        const {filter} = req.query
        if (filter) {
            const filterQuery = await utilDB.formatFilter(mapFields, filter)
            where += ` and (${filterQuery})`
        }

        const sql = `select id,theword as music_styles from _uniquewords where ${where} limit ${offset}, ${limit}`

        const result = await db.query(sql)

        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'genre',
              id: element.id.toString(),
              attributes: {
                name: element.music_styles
              }
          })  
        })

        let links = await utilDB.getLinks(offset, limit, '_uniquewords', where)

        links = await utilDB.formatLinks(req, links)

        const response = {
            "data": data,
            "links": links
        }
    
        return response
    }

    return module
}