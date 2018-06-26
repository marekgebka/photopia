var express = require('express'),
    app = express();



app.set("view engine", "ejs");

app.get('/', function(req, res){
  res.render('landing');
});

app.get('/gallery', function(req, res){
  var gallery = [
    {name: 'Central', image: 'https://source.unsplash.com/random/500x500'},
    {name: 'Maximize', image: 'https://source.unsplash.com/random/500x501'},
    {name: 'Business-focused', image: 'https://source.unsplash.com/random/500x502'}
  ]

  res.render('gallery', {gallery : gallery});
});

app.listen(3000, function(){
  console.log('The Photopia server has started!');
});