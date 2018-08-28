var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/photopia', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// Schema Setup
var photoSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Photo = mongoose.model("Photo", photoSchema);

Photo.create({
  name: 'Maximize',
  image: 'https://source.unsplash.com/random/500x501'
}, function(err, photo){
  if(err){
    console.log(err);
  } else {
    console.log("Newly created photo");
    console.log(photo);
  }
});


var gallery = [
  {name: 'Central', image: 'https://source.unsplash.com/random/500x500'},
  {name: 'Maximize', image: 'https://source.unsplash.com/random/500x701'},
  {name: 'Business-focused', image: 'https://source.unsplash.com/random/500x302'},
  {name: 'Central', image: 'https://source.unsplash.com/random/500x500'},
  {name: 'Maximize', image: 'https://source.unsplash.com/random/500x1001'},
  {name: 'Business-focused', image: 'https://source.unsplash.com/random/500x502'},
  {name: 'Central', image: 'https://source.unsplash.com/random/500x500'},
  {name: 'Maximize', image: 'https://source.unsplash.com/random/500x301'},
  {name: 'Business-focused', image: 'https://source.unsplash.com/random/500x502'},
]


app.get('/', function(req, res){
  res.render('landing');
});

app.get('/gallery', function(req, res){
  res.render('gallery', {gallery : gallery});
});

app.post('/gallery', function(req, res){
  var name = req.body.name,
      image = req.body.image,
      newImage = {
        name: name,
        image: image
      };
  
  gallery.push(newImage);
  res.redirect('/gallery');
});

app.get('/gallery/new', function(req, res){
  res.render('new');
});

app.listen(3000, function(){
  console.log('The Photopia server has started!');
});