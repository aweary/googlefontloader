import microbe from 'microbe.js'
import fs from 'fs'
import querystring from 'querystring'
import mongoose from 'mongoose'
import octonode from 'octonode'
import request from 'request-promise'
import bugger from 'debug'

import auth from './auth.js'
import data from './lib/data.js'
import metadata from './lib/metadata.js'
import structure from './lib/structure.js'
import description from './lib/description.js'
import Font from './lib/models/font.js'
import routes from './lib/routes.js'
import { formatURL }  from './lib/util.js'

const headers = auth.header
const app = microbe()
const client = octonode.client(auth.token)
const repo = client.repo('google/fonts')

mongoose.connect('mongodb://localhost/fonts')
const db = mongoose.connection

/* Format the URLs for all known Google Fonts folders */
const urls = formatURL(['ofl'])

let cache = []

/* Collect the promises for the font requests */
let requests = []

/* Push all promises into the requests array */
urls.forEach(url => {
  requests.push(request({ url, headers }))
})

/* Once all font requests are resolved, cache them */
Promise.all(requests)
  .then(values => cacheFonts(values))
  .then(fonts => data(fonts))
  .then(results => console.log(results))

function cacheFonts(rawData) {


  let debug = bugger('cacheFonts')

  return new Promise((resolve, reject) => {

    Object.keys(rawData).forEach(key => {
      let fonts = JSON.parse(rawData[key])
      cache = cache.concat(fonts)
      debug('Added %o fonts to cache', fonts.length)
    })
    debug('Resolving with %o items in cache', cache.length)
    resolve(cache)

  })
}


/**
 * use the Github API wrapper to populate an in-memory cache of the
 * fonts and their metadata.
 * @param  {[type]} root  [description]
 * @param  {[type]} cache [description]
 * @return {[type]}       [description]
 */


function getFonts(root) {

  return new Promise((resolve, reject) => {

    repo.contents(root, function(err, contents) {

      if (err) console.log(err)
      let length = contents.length

      contents.forEach((details) => {
        let index = contents.indexOf(details)
        let name = details.name
        let path = details.path
        let sha = details.sha
        let url = details.url

        fontCache.push({ name, path, sha, url })

        if (index === length - 1) resolve(fontCache)

      })
    })
  })
}

function parseFonts(fonts) {

  return new Promise((resolve, reject) => {

    let length = fonts.length
    fonts.forEach(font => {

      let path = font.path
      let index = fonts.indexOf(font)

      repo.contents(path, function(err, contents) {
        if (err) throw new Error(err)
        font.contents = contents
        if (index === length - 1) resolve(fonts)
      })
    })

  })
}



routes(app, cache)

app.start(8080, function() {
  console.log('Started on port 8080')
})
