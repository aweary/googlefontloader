export default function(app, fonts) {

  app.route('/', (req, res) => {
    res.static('index.html')
  })

  app.route('/api', (req, res) => {
    res.json(fonts)
  })

}
