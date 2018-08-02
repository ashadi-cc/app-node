module.exports = (db) => {

    let module = {}
    
    module.getTrack = async function (id) {
        const fields = 'recid,title,track,description,duration,moods,music_styles,tempobpm,trackversion,path'
        const filter = id ? `and recid = ${id}`: ''
        const where = `where agentcode = 'SOR' ${filter} and mainversion = 1`
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
    
        if (id) {
            data = data.length ? data[0] : {}
        }
    
        const response = {
            "data": data
        }
    
        return response    
    }
    
    module.getAlternate = async function (id) {
        let sql = `select trackspertitle, id_disc from music where recid = ${id}`
        let result = await db.query(sql)
    
        if (!result.length) return {"data": []}
        const rec = result[0]
        const where = ` where agentcode = 'SOR' and trackspertitle = '${rec.trackspertitle}' and id_disc = ${rec.id_disc} and recid <> ${id}`
        const fields = 'recid,title,track,description,duration,moods,music_styles,tempobpm,trackversion,path'
    
        sql = `select ${fields} from music ${where}`
    
        result = await db.query(sql)
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


