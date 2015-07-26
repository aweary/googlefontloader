

import request from 'request-promise'
import querystring from 'querystring'
import auth from '../auth.js'

const url = 'http://fonts.googleapis.com/css'

/**
 * getMetaData
 * @param {Object} repo github repo API object
 * @param  {Object} font font details
 */

export default function getMetadata(font) {

  if (!font) return
  if (!font.downloads) font.downloads = {}
  if (!font.filenames) font.filenames = []

  font.dataFiles.forEach((data) => {

    /* If the file is a TTF font file, cache it's name and URL */
    if (data.path.match(/\.ttf$/)) {
      font.downloads[data.name] = data.download_url
      font.filenames.push(data.name)
    }

    /* Parse the METADATA.json files */
    if (data.name === 'METADATA.json') {
      request({url: data.url, headers: auth.header })
        .then(function(data) {
          var metadataJSON = decodeBufferContent(data)
          var metadata = JSON.parse(metadataJSON)
          parseMetadata(font, metadata)
        })
        .catch(function(err) {
          if (failedRequests.indexOf(data) == -1) failedRequests.push(data)
        })
    }

    if (data.name === 'DESCRIPTION.en_us.html') {
      request({url: data.url, headers: auth.header })
        .then(function(data) {
          var data = JSON.parse(data)
          var buff = new Buffer(data.content, 'base64')
          font.description = buff.toString()
        })
        .catch(function(err) {
          console.log('Description error: ', err)
        })
    }

  })


  /**
   * create a Buffer object from the data.content property
   * and decode the base64 content
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function decodeBufferContent(data) {
    var data = JSON.parse(data)
    return new Buffer(data.content, 'base64').toString()
  }

  /**
   * parseMetadata
   * @param  {String} body HTTP response body
   * @private
   * @summary parses the metadata file and creates a stripped down
   *          itendifier for the font, along with a link to the
   *          Google Fonts page
   */

  function parseMetadata(font, content) {

    font.metadata = content
    /* Check for a metadata.name property in case its absent */
    if (font.metadata.name) {
      let query = querystring.stringify({family: font.metadata.name})
      font.webfontLink = url + '?' + query
      font.strippedName = font.metadata.name.replace(/\s+/g, '')
    }

  }

  /**
   * handleFailedRequest
   * @param  {Object} err HTTP error object
   * @private
   * @summary attempts to retry the http request if it fails
   */
  function handleFailedRequest(err) {
    console.log(err)
  }

}
