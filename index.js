var express = require('express');
var app = express();
var sharp = require('sharp');
var path = require('path');
const { fromString } = require('uuidv4');


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
 
app.use(express.static('public'));
app.use('/images', express.static('public/media/t/v16'));










/**
 * Route to directories containing Endpoints
 */

var users = require('./hr/users.js');

app.use('/hr', users);


var newsfeed = require('./feed/feed.js');

app.use('/feed', newsfeed);





































app.get('/mediaInfo', function(req, res) {
    const image = sharp(`public/media/t/v16/bz_1638176080494_5906823.jpeg`);
    var width;
    var height;
 
    image
        .metadata()
        .then(function (metadata) {
            width = Math.round(metadata.width);
            height = Math.round(metadata.height);
            return res.status(200).json({
                status: "success",
                features: {
                    watermark: `${metadata.density}x${metadata.orientation}`,
                    dimensions: `${width}.${height}`,
                    setUrl: `${generateString(70)}`,
                    data: metadata
                },
            });
        })


    // program to generate random strings

    // declare all characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_[$]&';

    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

});






//Other routes here
app.get('*', function (req, res) {
    res.status(404).send('Sorry, this is an invalid URL.');
});

app.listen(7000);