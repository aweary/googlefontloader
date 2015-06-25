/* Setup Microbe.js web server */
var microbe = require('microbe.js');
var app = microbe();
var auth = require('./auth.js');
var fs = require('fs');


/* Get the Github client for google/fonts */
var client = require('octonode').client(auth.token);
var repo = client.repo('google/fonts');

/* Load the cached fonts to avoid so many API calls */
var fontCache = JSON.parse(fs.readFileSync('fonts.json'));

/* Cache the names too, for easy reference */
var fontNameCache = JSON.parse(fs.readFileSync('fontnames.json'));
if (!fontNameCache.apache) fontNameCache.apache = [];

/* Hit the apache fonts first */
repo.contents('apache', function(err, contents){

	/* Check for any font names that have not already been cached */
	contents.forEach((folder) => { 
		if(fontNameCache.apache.indexOf(folder.name) === -1 ) fontNameCache.apache.push(folder.name) 
	});

	/* Close out the JSON file and update it's contents */
	var fontNames = JSON.stringify(fontNameCache);
    fs.writeFile('fontnames.json', fontNames, function(err) { if (err) console.log(err);
    });
});




app.route('/', function(req, res) {
  res.render('index', {fonts: fonts});
});

app.start(3000, function() {
  console.log('Started on port 3000');
})
