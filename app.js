var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Photo = require('./models/photo'),
    seedDB = require('./seeds')



mongoose.connect('mongodb://localhost:27017/photopia', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

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
  Photo.findById(req.params.id).populate('comments').exec(function(err, foundPhoto){
    if(err){
      console.log(err);
    } else {
      res.render('show', {photo: foundPhoto});
    }
  });
});

app.listen(3001, function(){
  console.log('The Photopia server has started!');
});