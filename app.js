var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Photo = require('./models/photo'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds')



mongoose.connect('mongodb://localhost:27017/photopia', {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
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
      res.render('gallery/index', {gallery : allPhotos});
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
  res.render('gallery/new');
});

// Show
app.get('/gallery/:id', function(req, res){
  Photo.findById(req.params.id).populate('comments').exec(function(err, foundPhoto){
    if(err){
      console.log(err);
    } else {
      res.render('gallery/show', {photo: foundPhoto});
    }
  });
});

// ===========================================================
// Comments Routes
// ===========================================================

app.get('/gallery/:id/comments/new', function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {gallery: gallery});
    }
  });
});

app.post('/gallery/:id/comments', function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
      res.redirect('/gallery');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          gallery.comments.push(comment);
          gallery.save();
          res.redirect('/gallery/' + gallery._id);
        }
      });
    }
  });
});

app.listen(3001, function(){
  console.log('The Photopia server has started!');
});