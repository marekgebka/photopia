var express = require('express');
var router = express.Router({mergeParams: true});
var Photo = require('../models/photo');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// Comments new
router.get('/new',middleware.isLoggedIn, function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {gallery: gallery});
    }
  });
});

// Coments create
router.post('/',middleware.isLoggedIn, function(req, res){
  Photo.findById(req.params.id, function(err, gallery){
    if(err){
      console.log(err);
      res.redirect('/gallery');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash('error', 'Something went wrong!');
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          gallery.comments.push(comment);
          gallery.save();
          req.flash('success', 'Successfully added comment!');
          res.redirect('/gallery/' + gallery._id);
        }
      });
    }
  });
});

// Edit Comments
router.get('/:comments_id/edit',middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comments_id, function(err, foundComment){
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {gallery_id: req.params.id, comment: foundComment});
    }
  });
});

// Update Comment
router.put('/:comments_id',middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/gallery/' + req.params.id);
    }
  });
});

// Delete Comment
router.delete('/:comments_id',middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comments_id, function(err){
    if(err){
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted!');
      res.redirect('/gallery/' + req.params.id);
    }
  });
});


module.exports = router;