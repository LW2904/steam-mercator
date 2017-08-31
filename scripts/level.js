const request = require('request')
const cheerio = require('cheerio')

exports.get = function (id) {
  return new Promise((resolve, reject) => {
    request('http://steamcommunity.com/profiles/' + id.toString(), (err, res, body) => {
      if (err || res.statusCode !== 200)
        reject(err || res.statusCode)

      const $ = cheerio.load(body)
      const level = parseInt(($('.friendPlayerLevelNum')[0].children[0].data), 10)

      if (level) { resolve(level) } else reject()
    })
  })
}
