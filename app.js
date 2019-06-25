
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    LinearRegression = require('shaman').LinearRegression,
    request = require('request'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user');

var authRoutes = require('./routes/index'),
    movieRoutes = require('./routes/movies');

mongoose.connect("mongodb://localhost/myimdb", {useNewUrlParser: true});

app.use(require('express-session')({
    secret: "Random text to encode passwords",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRoutes);
app.use(movieRoutes);

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, function () {
    console.log('MyIMDB listening on port 3000!');
});
