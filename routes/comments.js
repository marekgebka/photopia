var express = require('express');
var router = express.Router({mergeParams: true});
var Photo = require('../models/photo');
var Comment = require('../models/comment');

// Comments new
router.get('/new',isLoggedIn, function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {gallery: gallery});
    }
  });
});

// Coments create
router.post('/',isLoggedIn, function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
      res.redirect('/gallery');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          gallery.comments.push(comment);
          gallery.save();
          res.redirect('/gallery/' + gallery._id);
        }
      });
    }
  });
});

// Edit Comments
router.get('/:comments_id/edit', function(req, res){
  Comment.findById(req.params.comments_id, function(err, foundComment){
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {gallery_id: req.params.id, comment: foundComment});
    }
  });
});

// Update Comment
router.put('/:comments_id', function(req, res){
  Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect('back');
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