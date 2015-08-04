import request from 'request-promise'
import parse from './metadata.js'
import auth from '../auth.js'

export default function(font) {

  return new Promise(function(resolve, reject) {

    let url = font.url
    let headers = auth.header

    request({ url, headers })
      .then(data => {
        font.dataFiles = JSON.parse(data)
        resolve(font)
      })

      .catch(err => reject(err))

  })
}
