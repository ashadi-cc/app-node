const Path = require('path')

module.exports = (db) => {

    let module = {}

    //mapping fields json => db
    const mapFields = {
        "id": "recid",
        "agent": "agent",
        "catalog": "label",
        "album": "disc",
        "title": "title",
        "track": "track",
        "description": "description",
        "moods": "moods",
        "music_styles": "music_styles",
        "path": "path",
        "duration": "duration",
        "tempobpm": "tempobpm",
        "trackversion": "trackversion"
    }

    //default display fields
    const defaultField = 'catalog,album,title,track,description,duration,path'

    //default where clause
    const mainWhere = `and agentcode = 'SOR'`

    // mapping field function
    const mappingField = (fields, record) => {
        let rec = {
            id: record[mapFields.id].toString(),
            type: 'tracks',
            attributes: {}
        }

        fields.forEach(element => {
            if (mapFields[element]) {
                rec.attributes[element] = record[mapFields[element]]
            }
        })

        //set url attributes
        let path,folder;
        path = record.path.toString().replace(':', '/')
        //filename = Path.basename(path)
        folder = Path.dirname(path)
        rec.attributes.url_audio = 'https://netmixeur.' + path.replace('.wav', '.mp3')
        rec.attributes.url_coverart = 'https://netmixeur.' + folder + '/coverart.jpg'
        rec.attributes.url_waveform = 'https://netmixeur.' + path.replace('/AudioFiles/', '/AudioFiles/waveforms/').replace('.wav', '.mp3')

        return rec
    }

    module.getBaseQueryTrack = async function(requestFields, whereClause) {
        const fields = Object.values(mapFields).join(',')
        const sql = `select ${fields} from music where ${whereClause} ${mainWhere}`
        const musicResult = await db.query(sql)

        let data = []
        let item;

        requestFields = requestFields ? requestFields : defaultField

        let arrayqueryField = requestFields.toString().toLowerCase().split(',')
        //remove id
        arrayqueryField = arrayqueryField.filter(e => e !== 'id');
        arrayqueryField = arrayqueryField.filter(e => e !== 'path');

        musicResult.forEach(element => {
            item = mappingField(arrayqueryField, element)
            data.push(item)
        })

        const response = {
            "data": data
        }
    
        return response
    }
    
    module.getTrack = async function (req) {
        const whereClause = `mainversion = 1`
        
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''

        const response = await this.getBaseQueryTrack(requestFields, whereClause)

        return response
    }

    module.getTrackById = async function (id, req) {
        const whereClause = `recid = '${id}'`

        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''

        const response = await this.getBaseQueryTrack(requestFields, whereClause)

        return response
    }
    
    module.getAlternate = async function (id, req) {
        let sql = `select trackspertitle, id_disc from music where recid = ${id}`
        let result = await db.query(sql)
    
        if (!result.length) return {"data": []}

        const rec = result[0]
        const whereClause = `trackspertitle = '${rec.trackspertitle}' and id_disc = ${rec.id_disc} and recid <> ${id}`
        //request fields
        const requestFields = req.query.fields ? req.query.fields : ''
        const response = await this.getBaseQueryTrack(requestFields, whereClause)

        return response
    }


    return module
}


