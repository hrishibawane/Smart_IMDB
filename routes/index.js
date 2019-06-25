var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    request = require('request'),
    passport = require('passport'),
    User = require('../models/user'),
    mongoose = require('mongoose');

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

router.get('/', function (req, res) {


    res.render("home");
});

router.get('/signup', function (req, res) {
    res.render("signup");
});

router.get('/login', function (req, res) {
    res.render("login");
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}),
    function (req, res) {
    });

router.post('/signup', function (req, res) {

    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            throw err;
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/logout', function (req, res) {
    console.log('Bye');
    req.logout();
    res.redirect('/');
});


module.exports = router;