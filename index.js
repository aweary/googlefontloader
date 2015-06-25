'use strict';

/* Setup Microbe.js web server */
const microbe = require('microbe.js');
const app = microbe();
const auth = require('./auth.js');
const fs = require('fs');
const crypto = require('crypto');
const metadata = require('./lib/metadata.js');


/* Get the Github client for google/fonts */
var client = require('octonode').client(auth.token);
var repo = client.repo('google/fonts');

/* Cache the names too, for easy reference */
var fontCache = JSON.parse(fs.readFileSync('fonts.json'));
if (!fontCache.apache) fontCache.apache = {};
if (!fontCache.count) fontCache.count = 0;

/* Alias a local variable to the object property for easy access */
var apache = fontCache.apache;
var fonts = [];

/* Hit the apache fonts first */
repo.contents('apache', function(err, contents) {

  if (err) console.log(err);

  contents.forEach((details) => {

    /* If the font hasn't been cached or has changed,  re/add it */
    if (!apache[details.name] || (apache[details.name].sha !== details.sha)) {
      apache[details.name] = details;
    }

  });

  /* Add the font objects to an iteratable list */
  Object.keys(apache).forEach((key) => {
    fonts.push(apache[key]);
  });

  /* Get the data for each font */
  fonts.forEach((font) => metadata(repo, font));


  /* Close out the JSON file and update it's contents */
  let fontNames = JSON.stringify(fontCache);
  fs.writeFile('fonts.json', fontNames, function(err) {
    if (err) console.log(err);
  });

});



app.route('/', function(req, res) {
  res.render('index', {fonts: fonts});
  console.log(fonts);
});

app.start(3000, function() {
  console.log('Started on port 3000');
})
