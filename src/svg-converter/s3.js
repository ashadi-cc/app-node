const AWS = require('aws-sdk')
const fs = require('fs')
const BUCKET_NAME = process.env.S3_BUCKET_NAME
const USER_KEY = process.env.S3_KEY
const USER_SECRET = process.env.S3_SECRET_KEY
const REGION = process.env.S3_REGION

module.exports = (db) => {
    let module = {}
    let s3Bucket = new AWS.S3({
        accessKeyId: USER_KEY,
        secretAccessKey: USER_SECRET,
        region: REGION
    })

    module.upload = async function({path, dest, destSvg, recid}) {
        const keyFile = path.replace('s3.amazonaws.com/', '').replace('.wav', '.svg.gz')

        return new Promise((resolve, reject) => {
            fs.readFile(destSvg, (err, data) => {
                if (err) throw err
                s3Bucket.createBucket(() => {
                    let params = {
                        Bucket: BUCKET_NAME,
                        Key: keyFile,
                        ACL: 'public-read',
                        Body: data,
                        ContentEncoding: 'gzip',
                        ContentType: 'image/svg+xml'
                    }
                    console.log('starting upload to s3 bucket', keyFile)
                    s3Bucket.upload(params, (err, data) => {
                        console.log('done uploading to s3 bucket', keyFile)
                        if (err == null) {
                            fs.unlinkSync(dest)
                            fs.unlinkSync(destSvg)
                            let sql =`update music set svgurl = '${data.Location}' where recid = '${recid}'`
                            db.query(sql, (err, msg) => {
                                console.log('success updating svgurl  for recid', recid)
                                resolve({recid: recid, Location: data.Location})
                            })
                        } else {
                            reject(err)
                        }
                    })
                })
            })
        })
    }

    return module
}