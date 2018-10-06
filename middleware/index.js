const Photo = require('../models/photo');
const Comment = require('../models/comment');
// All the middleware goes here
let middlewareObj = {};

//Ensures only the original Uploader of the Photo can change/delete it
middlewareObj.checkPhotoOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Photo.findById(req.params.id, function(err, foundPhoto){
      if(err){
        req.flash('error', 'Photo not Found!');
        res.redirect('back');
      } else {
        if(foundPhoto.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'Permission Denied!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('back');
  }
};

//Ensures only the Owner of the Comment has the right to modify/delete it
middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comments_id, function(err, foundComment){
      if(err){
        res.redirect('back');
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'Permission Denied!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('back');
  }
};

//Prevents Unauthorized Posting/Commenting in the App
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be logged in to do that!');
  res.redirect('/login');
};

module.exports = middlewareObj;