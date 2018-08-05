const Util = require('./util')

module.exports = (db) => {
    let module = {}

    const utilDB = Util(db)

    module.getMood = async function (req) {

        let where = `fieldname = 'moods'`

        const {offset, limit} = req.query.page ? req.query.page : { offset: 0, limit: 5}
        
        if (req.query.q) {
            const q = req.query.q
            where += ` and theword like '%${q}%'`
        }

        const sql = `select id,theword as moods from _uniquewords where ${where} limit ${offset}, ${limit}`

        const result = await db.query(sql)
        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'moods',
              id: element.id.toString(),
              attributes: {
                name: element.moods
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