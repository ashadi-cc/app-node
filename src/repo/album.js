
module.exports = (db) => {

    let module = {}
    
    module.getAlbum = async function (id) {
        let where = '';
    
        if (id) {
            where = `and id_disc = ${id}`
        }
    
        const sql = `select id_disc, disc, label, folder from music where agentcode = 'SOR' ${where} group by id_disc, disc, label, folder`
    
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
    
        if (id) {
            data = data.length ? data[0] : {}
        }
    
        const response = {
            "data": data
        }
    
        return response
    }
    
    module.getTrack = async function (id) {
        const fields = 'recid,title,track,description,duration,moods,music_styles,tempobpm,trackversion,path'
        const where = `where agentcode = 'SOR' and id_disc = ${id} and mainversion = 1`
        const sql = `select ${fields} from music ${where}`
    
        const result = await db.query(sql)
        let data = []
    
        result.forEach(element => {
          data.push({
              type : 'tracks',
              id: element.recid.toString(),
              attributes: {
                title: element.title,
                track: element.track,
                description: element.description,
                duration: element.duration,
                moods: element.moods,
                genre: element.genre,
                tempobpm: element.tempobpm,
                trackversion: element.trackversion,
                url_audio: element.path,
                url_coverart: element.path,
                url_waveform: element.path
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


