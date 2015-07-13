const request = require('request-promise');
const parseMetadata = require('./metadata.js');
const auth = require('../auth.js');


console.log(parseMetadata);

module.exports = function(fontCache) {

  /* Get a list of all the font names in the cache */
  var keys = Object.keys(fontCache);

  /* For every font, make a request to their git url for the metadata locations */
  keys.forEach((key) => {

    var font = fontCache[key];

    request({url: font.url, headers: auth.header})
      /* If the response was successful, parse it as JSON and pase to to parseMetadta */
      .then(function(data) {
        font.dataFiles = JSON.parse(data);
        parseMetadata(font);
      })
      .catch(function(err) { console.log('Request error: ', err) });

  });

}
