const http = require('https')
const Axios = require('axios')
const Fs = require('fs')
const Path = require('path')
const audioToSvgWaveform = require('audio-to-svg-waveform')


module.exports = (db) => {

    const s3 = require('./s3')(db)

    let module = {}
    /**
     * convert svg
     */
    module.convert = async function() {
        const sql = `SELECT recid, path FROM music WHERE svgurl IS NULL Order By RecID LIMIT 0,10`
        const result = await db.query(sql)
        let path, url
        var res = []
        result.forEach(element => {
            path = element.path.toString().replace(':', '/')
            url = encodeURI('https://netmixeur.' + path.replace('.wav', '.mp3'))
            res.push(
                saveMp3File(url, path, element.recid)
            )
        })
        Promise.all(res).then((result) => {
            let uploads = []
            result.forEach(element => {
                uploads.push(s3.upload(element))
            })
            
            Promise.all(uploads).then(resUpload => {
                console.log(resUpload)
                console.log('finding null svgurl')
                let sql = 'select count(recid) as total from music where svgurl is null'
                db.query(sql, (err, result) => {
                    let total = result[0].total
                    if (total > 0) {
                        module.convert()
                    } else {
                        process.exit()
                    }
                })
                
            })
        })
    }

    const saveMp3File = async function(url, path, recid) {
        const audioFile = url.split('/').pop()
        const svgFile = audioFile.replace('.mp3', '.svg.gz')
        const dest = Path.resolve(__dirname, 'audio', audioFile)
        const destSvg = Path.resolve(__dirname, 'svg', svgFile)

        console.log(`start download file ${url}`)
        const response = await Axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        })

        response.data.pipe(Fs.createWriteStream(dest))

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                console.log(`finish download file ${url}`)
                audioToSvgWaveform(dest, destSvg).then(() => {
                    resolve({dest, destSvg, path, recid})
                })
            })

            response.data.on('error', (err) => {
                reject(err.message)
            })
        })
    }

    return module
}