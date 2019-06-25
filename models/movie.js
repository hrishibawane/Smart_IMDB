var mongoose = require('mongoose');

var MovieDetails = new mongoose.Schema({

    id: Number,
    title: String,
    comments: [
        {
            type: mongoose.Schema.Types.String,
            ref: "movie"
        }
    ]
});

module.exports = mongoose.model("movie", MovieDetails);
