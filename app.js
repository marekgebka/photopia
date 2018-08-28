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
  image: String,
  description: String
});
var Photo = mongoose.model("Photo", photoSchema);

// Photo.create({
//   name: 'Granite Hill',
//   image: 'https://source.unsplash.com/random/500x500',
//   description: 'This is a huge granite hill, no bathrooms, no water, Beautiful Granite!!'
// }, function(err, photo){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Newly created photo");
//     console.log(photo);
//   }
// });


app.get('/', function(req, res){
  res.render('landing');
});

// Index
app.get('/gallery', function(req, res){
  Photo.find({}, function(err, allPhotos){
    if(err){
      console.log(err);
    } else {
      res.render('index', {gallery : allPhotos});
    }
  });
});

// Create
app.post('/gallery', function(req, res){
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description
      newImage = {
        name: name,
        image: image,
        description: desc
      };
  Photo.create(newImage, function(err, newImage){
    if(err){
      console.log(err)
    } else {
      res.redirect('/gallery');
    }
  });
});

// New
app.get('/gallery/new', function(req, res){
  res.render('new');
});

// Show
app.get('/gallery/:id', function(req, res){
  Photo.findById(req.params.id, function(err, foundPhoto){
    if(err){
      console.log(err);
    } else {
      res.render('show', {photo: foundPhoto});
    }
  });
});

app.listen(3000, function(){
  console.log('The Photopia server has started!');
});