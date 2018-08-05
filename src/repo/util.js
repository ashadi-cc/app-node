const util = db => {
    
    let module = {}

    module.getLinks = async (start, limit, table, where, groupBy) => {
        let sql;

        if (groupBy) {
            sql = `SELECT COUNT(DISTINCT ${groupBy}) AS total FROM ${table} WHERE ${where}`
        } else {
            sql = `SELECT count(*) AS total FROM ${table} WHERE ${where}`
        }
        const result = await db.query(sql)

        const total = result.length ? result[0]['total'] : 0
        let lastOffset = (Math.floor((total / limit)) * limit)

        if (lastOffset >= total) {
            lastOffset = lastOffset - limit
        }

        const prev = (start == 0) ? null : (start - limit)
        const next = ((start + limit) >= total) ? null : (start + limit)

        let links = {}

        links.first = `page[offset]=0&page[limit]=${limit}`
        links.last = `page[offset]=${lastOffset}&page[limit]=${limit}`
        if (prev != null) links.prev = `page[offset]=${prev}&page[limit]=${limit}`
        if (next != null) links.next = `page[offset]=${next}&page[limit]=${limit}`

        return links
    }

    module.formatLinks = async (req, links) => {
        const { headers, originalUrl, protocol, query} = req
        const { host } = headers
        let reqQuery = []

        for (var key in query) {
            if (key != 'page') {
                reqQuery.push(
                    `${key}=${query[key]}`
                )
            }
        }

        let additionalQuery = reqQuery.join('&')

        if (additionalQuery != "") {
            additionalQuery = `&${additionalQuery}`
        }
        
        const path = originalUrl.split('?')[0]

        const url =`${protocol}://${host}${path}?`

        let currentLink;
        for (var key in links) {
            currentLink = links[key]  +  additionalQuery
            links[key] = url + encodeURI(currentLink)
        }

        return links
    }

    return module
}

module.exports = util