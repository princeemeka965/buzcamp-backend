var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');
var sharp = require('sharp');
var path = require('path');


//create database connection
const conn = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5446611',
    password: 'xUIWKPYi5L',
    database: 'sql5446611'
});

//connect to database
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});





var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/t/v16')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + Math.floor(Math.random() * 10000000) + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage });


// file upload api
router.post('/create-media', upload.array('file'), async (req, res) => {
    
    await sharp(req.file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination, 'resized', file)
        )

    res.status(200).send(req.files)
    })





router.post('/create-status', (req, res) => {

    const photoPayLoad = req.body.photos;

    var parsePhotos;

    if(photoPayLoad.length > 1) {
        parsePhotos = photoPayLoad.toString();
    }
    else {
        parsePhotos = photoPayLoad;
    }

    let data = {
        content: req.body.content,
        duration: req.body.duration,
        photos: parsePhotos
    };

    let sql_2 = "INSERT INTO status SET ?";
    let query = conn.query(sql_2, data, (err, results) => {
        if (err) {
            res.status(400).send({ success: false, message: "Error in posting status" });
        }
        else {
            res.status(200).send({ success: true, message: "Done... Status Posted" });
        }
    });
})




//export this router to use in our index.js
module.exports = router;


