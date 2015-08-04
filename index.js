import microbe from 'microbe.js'
import fs from 'fs'
import querystring from 'querystring'
import mongoose from 'mongoose'
import octonode from 'octonode'

import auth from './auth.js'
import data from './lib/data.js'
import metadata from './lib/metadata.js'
import structure from './lib/structure.js'
import description from './lib/description.js'
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

      data({ name, path, sha, url })
        .then(result => structure(result))
          .catch(err => { throw err })
        .then(result => metadata(result))
          .catch(err => { throw err })
        .then(result => description(result))
          .catch(err => { throw err })
        .then(result => {
          let font = new Font(result)
          font.save(function() {
            console.log('Saved %j!', font.name)
          })
        })

    })
  })

}

routes(app, fontCache)

app.start(8080, function() {
  console.log('Started on port 8080')
})
