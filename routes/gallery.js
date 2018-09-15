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
router.post('/', function(req, res){
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

// New route
router.get('/new', function(req, res){
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

module.exports = router;