var express = require('express'),
    router = express.Router(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    MD = require('../models/movie');

const { apiURL, apiKey } = require('../config');
const imageURL = 'http://image.tmdb.org/t/p/w342';
const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

var genFreq = {
    '28': 0,
    '12': 0,
    '16': 0,
    '35': 0,
    '80': 0,
    '99': 0,
    '18': 0,
    '10751': 0,
    '14': 0,
    '36': 0,
    '27': 0,
    '10402': 0,
    '9648': 0,
    '10749': 0,
    '878': 0,
    '53': 0,
    '10752': 0,
    '37': 0
};

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

router.get('/toprated', function(req, res) {

    request.get(apiURL + '/movie/top_rated' + apiKey, function(error, response, body) {

        if(error) throw error;
        res.render('toprated', {results: JSON.parse(body).results, imageURL: imageURL});
    });

});

router.get('/search/:title/:id', function (req, res) {

    console.log(req.params.title);

    MD.findOne({ id: req.params.id }, function (err, movie) {

        if (err) throw err;

        if(!movie) {
            MD.create({ id: req.params.id, title: req.params.title }, function (err, data) {
                if (err) throw err;
                console.log('movie inserted');
                request.get(apiURL + '/movie/' + req.params.id + apiKey, function (error, response, body) {

                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(JSON.parse(body));
                        res.render("details", { movie: JSON.parse(body), imageURL: imageURL, comments:[] });
                    }
                });
            });
        }
        else {
            request.get(apiURL + '/movie/' + req.params.id + apiKey, function (error, response, body) {

                if (error) {
                    console.log(error);
                }
                else {
                    console.log(JSON.parse(body));
                    res.render("details", { movie: JSON.parse(body), imageURL: imageURL, comments: movie.comments });
                }
            });
        }
    });


});

router.get('/watchlist', function (req, res) {

    User.findOne({ username: req.user.username }, function (err, user) {
        if (err) throw err;
        
        user.movies.forEach(function(movie) {
            var g = JSON.parse(movie).genre;
            genFreq[g] += 1;
        });

        const genMap = new Map([...Object.entries(genFreq)].sort((a,b) => b[1]-a[1]));
        var genString = "";
        
        var i=0;
        for(const [key, value] of genMap.entries()) {
            genString += key.toString();
            i+=1;
            if(i==3) break;
            genString += ",";
        }
        console.log(genMap);
        console.log(genString);

        request.get(apiURL + '/discover/movie' + apiKey + '&with_genres=' + genString, function(error, response, body) {
            
            if(error) throw error;
            //console.log(JSON.parse(body).results);
            res.render("watchlist", { movies: user.movies, rec: JSON.parse(body).results });
        });
    });

});

router.post('/watchlist', function (req, res) {

    console.log(req.body);

    User.findOne({ username: req.user.username }, function (err, user) {
        if (err) throw err;
        //console.log(user);

        var flag = 0;
        user.movies.find(function (title) {
            if (title == req.body.title) {
                flag = 1;
            }
        });

        if (!flag) {
            var mobj = {title: req.body.title, genre: req.body.genre};
            user.movies.push(JSON.stringify(mobj));
            user.save(function (err, data) {
                if (err) throw err;
                console.log('Added to Watchlist');
                //res.render("watchlist", { movies: user.movies });
                res.redirect('/watchlist');
            });
        }
        else {
            res.redirect('/watchlist');
        }
    });

});


router.post('/:id/comments', function (req, res) {

    console.log(req.body);
    MD.findOne({ id: req.params.id }, function (err, movie) {

        if (err) throw err;

        movie.comments.push(req.body.comment);
        movie.save(function (err, data) {
            if (err) throw err;
            console.log('comment inserted');

            request.get(apiURL + '/movie/' + req.params.id + apiKey, function (error, response, body) {

                if (error) {
                    console.log(error);
                }
                else {
                    console.log(JSON.parse(body));
                    res.render("details", { movie: JSON.parse(body), imageURL: imageURL, comments: movie.comments });
                }
            });
        })
    });

});

router.post('/search', function (req, res) {

    var movieName = req.body.movie;

    request.get(apiURL + '/search/movie' + apiKey + '&query=' + movieName, function (error, response, body) {

        if (error) {
            console.log(error);
        }
        else {
            console.log('Request Success');
            var results = JSON.parse(body).results;
            res.render("results", { results: results, genres: genres, imageURL: imageURL });
        }
    });

});

module.exports = router;