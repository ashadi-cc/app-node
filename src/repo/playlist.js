const Track = require('./track')

module.exports = (db) => {
    
    let module = {}
    
    const TrackRepo = Track(db)

    //map fields json => db
    const mapFields = {
        "id": "id",
        "title": "title",
        "description": "description",
        "url_image": "imagepath"
    }

    //default display fields
    const defaultField = 'title,description,url_image'

    //get all playlist
    module.getPlaylist = async function (req) {

        //request fields
        const requestFields = req.query.fields ? req.query.fields : defaultField

        let arrayqueryField = requestFields.toString().toLowerCase().split(',');
        //remove id
        arrayqueryField = arrayqueryField.filter(e => e !== 'id');

        let where = `published = 1 AND publishdatestart <= CURDATE()  and CURDATE() <= publishdateend and action like 'spot%'`; 
        
        if (req.query.q) {
            const q = req.query.q
            where += ` and title like '%${q}%'`
        }
        
        const fields = `id,title,description,concat('https://www.redbullaudiolibrary.com/',imagepath) as imagepath`
        const sql = `select ${fields} from _playlistbuttons WHERE  ${where} order by displayorder`
        
        const result = await db.query(sql)
        let data = []
        let rec = {}

        result.forEach(element => {
            rec = {
                id: element[mapFields.id].toString(),
                type: 'playlists',
                attributes: {}                
            }

            arrayqueryField.forEach(el => {
                if (mapFields.hasOwnProperty(el)) {
                    rec.attributes[el] = element[mapFields[el]]
                }
            })

            data.push(rec) 
        })
    
        const response = {
            "data": data
        }
    
        return response    
    }

    module.getById = async function(id, req) {
        let sql = `select action from _playlistbuttons where id = ${id}`
        const result = await db.query(sql)

        if (!result.length) return {"data": []}

        const rec = result[0]
        let whereClause = ''

        if (rec.action != '') {
            let actionArr = rec.action.split(',')
            let playlistType = actionArr[0]
            let idSearch = actionArr[1]

            if (playlistType == 'spot') {
                whereClause = `recid in (select stableid from _pm_sound where id_spot = '${idSearch}')`
            }
        }

        if (whereClause == '') return {"data": []}

        if (req.query.q) {
            const q = req.query.q
            whereClause += ` and description like '%${q}%'`
        }
        
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''

        const response = await TrackRepo.getBaseQueryTrack(requestFields, whereClause)

        return response
    }

    return module
}

