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

// Photo.create({
//   name: 'Maximize',
//   image: 'https://source.unsplash.com/random/500x501'
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

app.get('/gallery', function(req, res){
  Photo.find({}, function(err, allPhotos){
    if(err){
      console.log(err);
    } else {
      res.render('gallery', {gallery : allPhotos});
    }
  });
});

app.post('/gallery', function(req, res){
  var name = req.body.name,
      image = req.body.image,
      newImage = {
        name: name,
        image: image
      };
  Photo.create(newImage, function(err, newImage){
    if(err){
      console.log(err)
    } else {
      res.redirect('/gallery');
    }
  });
});

app.get('/gallery/new', function(req, res){
  res.render('new');
});

app.listen(3000, function(){
  console.log('The Photopia server has started!');
});