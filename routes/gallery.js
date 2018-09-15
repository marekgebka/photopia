var express = require('express');
var router = express.Router();
var Photo = require('../models/photo');

// Index route
router.get('/', function(req, res){
  Photo.find({}, function(err, allPhotos){
    if(err){
      console.log(err);
    } else {
      res.render('gallery/index', {gallery : allPhotos});
    }
  });
});

// Create route
router.post('/',isLoggedIn, function(req, res){
  var name = req.body.name,
      image = req.body.image,
      desc = req.body.description,
      author = {
        id: req.user._id,
        username: req.user.username
      }
      newImage = {
        name: name,
        image: image,
        description: desc,
        author: author
      };
  Photo.create(newImage, function(err, newImage){
    if(err){
      console.log(err)
    } else {
      res.redirect('/gallery');
    }
  });
});

// New route
router.get('/new',isLoggedIn, function(req, res){
  res.render('gallery/new');
});

// Show route
router.get('/:id', function(req, res){
  Photo.findById(req.params.id).populate('comments').exec(function(err, foundPhoto){
    if(err){
      console.log(err);
    } else {
      res.render('gallery/show', {photo: foundPhoto});
    }
  });
});

// Edit Route
router.get('/:id/edit', function(req, res){
  Photo.findById(req.params.id, function(err, foundPhoto){
    if(err){
      res.redirect('/gallery');
    } else {
      res.render('gallery/edit', {photo: foundPhoto});
    }
  });
});

// Update Route
router.put('/:id', function(req, res){
  Photo.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, updatedPhoto){
    if(err){
      res.redirect('/gallery');
    } else {
      res.redirect('/gallery/' + req.params.id);
    }
  });
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;