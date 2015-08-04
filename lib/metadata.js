import request from 'request'
import querystring from 'querystring'
import auth from '../auth.js'

import { decodeBufferContent } from './util.js'

const url = 'http://fonts.googleapis.com/css'

export default function(font) {

  return new Promise(function(resolve, reject) {

    let opts = {url: font.metadataURL, headers: auth.header }

    request(opts, function(err, response, body) {

      if (err) return reject(new Error(err))
      let data = JSON.parse(body)
      let buff = new Buffer(data.content, 'base64')
      let parsed = JSON.parse(buff.toString())
      let result = getMetadataInfo(font, parsed)
      resolve(result)
    })
  })

}

/**
* parseMetadata
* @param  {String} body HTTP response body
* @private
* @summary parses the metadata file and creates a stripped down
*          itendifier for the font, along with a link to the
*          Google Fonts page
*/

function getMetadataInfo(font, content) {

  font.metadata = content
  /* Check for a metadata.name property in case its absent */
  if (font.metadata.name) {
    let query = querystring.stringify({family: font.metadata.name})
    font.webfontLink = url + '?' + query
    font.strippedName = font.metadata.name.replace(/\s+/g, '')
  }

  return font
}
