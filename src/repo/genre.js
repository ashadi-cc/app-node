module.exports = (db) => {
    let module = {}

    module.getGenre = async function (req) {
        let sql = `select id,theword as music_styles from _uniquewords where fieldname = 'music_styles'`

        if (req.query.q) {
            const q = req.query.q
            sql += ` and theword like '%${q}%'`
        }

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

        const response = {
            "data": data
        }
    
        return response
    }

    return module
}