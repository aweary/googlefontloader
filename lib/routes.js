module.exports = function(app, fonts) {

  app.route('/', function(req, res) {
    res.static('index.html');
  });

  app.route('/api', function(req, res) {
    res.json(fonts);
  });

}
