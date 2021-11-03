var express = require('express');
var app = express();


//To parse URL encoded data
app.use(express.urlencoded({ extended: false }))

//To parse json data
app.use(express.json());


const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(express.static('public')); //to access the files in public folder




/**
 * Route to directories containing Endpoints
 */

var users = require('./hr/users.js');

app.use('/hr', users);


var newsfeed = require('./feed/feed.js');

app.use('/feed', newsfeed);





















//Other routes here
app.get('*', function (req, res) {
    res.status(404).send('Sorry, this is an invalid URL.');
});

app.listen(7000);