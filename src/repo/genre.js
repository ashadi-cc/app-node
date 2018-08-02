module.exports = (db) => {
    let module = {}

    module.getGenre = async function () {
        const sql = `select id,theword as music_styles from _uniquewords where fieldname = 'music_styles'`

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