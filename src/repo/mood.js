module.exports = (db) => {
    let module = {}

    module.getMood = async function (req) {
        let sql = `select id,theword as moods from _uniquewords where fieldname = 'moods'`

        if (req.query.q) {
            const q = req.query.q
            sql += ` and theword like '%${q}%'`
        }
        
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

        const response = {
            "data": data
        }
    
        return response
    }

    return module
}