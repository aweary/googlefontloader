import request from 'request'
import auth from '../auth.js'

/**
 * Make a request to the description HTML url
 * previously parsed and convert the buffer response
 * to a string and attach to the font object
 * @param  {Object} font
 * @return {Promise}
 */

export default function(font) {

  return new Promise(function(resolve, reject) {

    let opts = {url: font.descriptionURL, headers: auth.header }

    request(opts, function(err, response, body) {
      if (err) reject(new Error(err))
      let data = JSON.parse(body)
      let buff = new Buffer(data.content, 'base64')
      font.description = buff.toString()
      resolve(font)
    })
  })
}
