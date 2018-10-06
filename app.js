var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    Photo = require('./models/photo'),
    Comment = require('./models/comment'),
    User = require('./models/user')

// Requiring express router routes
var commentRoutes = require('./routes/comments'),
    galleryRoutes = require('./routes/gallery'),
    indexRoutes = require('./routes/index')


// mongoose.connect('mongodb://localhost:27017/photopia', {useNewUrlParser: true});
mongoose.connect('mongodb://darshan:123456789gg@ds155352.mlab.com:55352/photopia', {useNewUrlParser: true});

//Sets View Engine and Parser so that EJS files can be parsed to form HTML
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Serves the Public Directory for images/stylesheets
app.use(express.static(__dirname + '/public'));

app.use(methodOverride('_method'));

//Uses flash for displaying messages to the user
app.use(flash());

app.use(compression());

// Passport Configuration
app.use(require('express-session')({
  secret: '*&Scnkjdfy7dsgJGHSCjkjsyd7sd6yu3jhdkszhc7hbn*',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Express router
app.use('/', indexRoutes);
app.use('/gallery/:id/comments',commentRoutes);
app.use('/gallery', galleryRoutes);

app.listen(3000, function(){
  console.log('The Photopia server has started!');
});
