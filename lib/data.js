import request from 'request-promise'
import parse from './metadata.js'
import auth from '../auth.js'
import bugger from 'debug'
import { RateLimiter } from 'limiter'

/**
 * Cache a request to each fonts Github API
 * access point and then resolve once all
 * the requests have been fulfilled
 *
 * @param {array} fonts cached font list
 * @return {Promise}
 */

export default function(fonts) {



  let debug = bugger('data')
  debug('invoked with %o items', fonts.length)
  let limiter = new RateLimiter(5, 'second')

  return new Promise((resolve, reject) => {

    let responses = []
    let id = 0
    let len = fonts.length

    while (id <= len) {

      let font = fonts[id++]
      let url = 'https://api.github.com/'
      let headers = auth.header
      let options = { url, headers, resolveWithFullResponse: true}

      limiter.removeTokens(1, (err, remaining) => {

        request(options)

          .then(res => {
            responses.push(res)
            debug('Response %o recieved: %o', responses.length, font.path)
            if (responses.length === len) {
              debug('Resolving %o responses', responses.length)
              debug('Responses are: %o', responses)
             resolve([1, 2, 4, 5, 6])
            }
          })
          .catch(err => debug('Error for %o: %o', font.name, err.message))
      })

    }

  })

}
