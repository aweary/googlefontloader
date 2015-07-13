'use strict';

/* Setup Microbe.js web server */
const microbe = require('microbe.js');
const app = microbe();
const auth = require('./auth.js');
const fs = require('fs');
const querystring = require('querystring');
const mongoose = require('mongoose');
const data = require('./lib/data.js');

/* Get the Github client for google/fonts */
var client = require('octonode').client(auth.token);
var repo = client.repo('google/fonts');

/* Cache the fonts */
var fontCache = {};

/* Request the fonts for the apache and OLF folders on the Github repo */
getFonts('ofl', fontCache, data);
setTimeout(function() { getFonts('apache', fontCache, data); }, 10000)

/**
 * use the Github API wrapper to populate an in-memory cache of the
 * fonts and their metadata.
 * @param  {[type]} root  [description]
 * @param  {[type]} cache [description]
 * @return {[type]}       [description]
 */


function getFonts(root, cache, callback) {

  var finished = false;
  repo.contents(root, function(err, contents) {

    if (err) console.log(err);
    contents.forEach((details) => {

      /* If the font hasn't been cached or has changed,  re/add it */
      if (!cache[details.name] || (cache[details.name].sha !== cache.sha)) {
        cache[details.name] = details;
      }

      finished = contents.indexOf(details) === contents.length - 1;
      if (finished) callback(cache);

    });
  });
}

require('./lib/routes.js')(app, fontCache);

app.start(8080, function() {
  console.log('Started on port 8080');
})
