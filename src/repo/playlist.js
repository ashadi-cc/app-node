module.exports = (db) => {
    
    let module = {}

    module.getPlaylist = async function (id) {
        let where = ''; 
    
        if (id) {
            where = `and id = ${id}`
        }
        const sql = `select id,title,description,concat('https://www.redbullaudiolibrary.com/',imagepath) as imagepath  from _playlistbuttons WHERE published = 1 AND publishdatestart <= CURDATE()  and CURDATE() <= publishdateend and action like 'spot%' ${where}
        order by displayorder`
        const result = await db.query(sql)
        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'playlists',
              id: element.id.toString(),
              attributes: {
                title: element.title,
                description: element.description,
                url_image: element.imagepath
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
    
    return module
}

