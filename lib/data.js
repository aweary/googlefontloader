import request from 'request-promise'
import parse from './metadata.js'
import auth from '../auth.js'

export default function(font, callback) {

  let url = font.url
  let headers = auth.header

  request({ url, headers })
    .then(data => font.dataFiles = JSON.parse(data))
    .catch(err => console.log(err))
}
