import microbe from 'microbe.js'
import fs from 'fs'
import querystring from 'querystring'
import mongoose from 'mongoose'
import octonode from 'octonode'

import auth from './auth.js'
import data from './lib/data.js'
import Font from './lib/models/font.js'
import routes from './lib/routes.js'

const app = microbe()
const client = octonode.client(auth.token)
const repo = client.repo('google/fonts')

mongoose.connect('mongodb://localhost/fonts')
const db = mongoose.connection

const fontCache = {}

/* Request the fonts for the apache and OLF folders on the Github repo */
getFonts('ofl')
getFonts('apache')

/**
 * use the Github API wrapper to populate an in-memory cache of the
 * fonts and their metadata.
 * @param  {[type]} root  [description]
 * @param  {[type]} cache [description]
 * @return {[type]}       [description]
 */


function getFonts(root) {

  repo.contents(root, function(err, contents) {

    if (err) console.log(err)

    contents.forEach((details) => {

      let name = details.name
      let path = details.path
      let sha = details.sha
      let url = details.url

      let fontData = { name, path, sha, url }
      let font = new Font(data)

    })
  })
}

routes(app, fontCache)

app.start(8080, function() {
  console.log('Started on port 8080')
})
