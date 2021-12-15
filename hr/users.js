var express = require('express');
var router = express.Router();
var mysql = require('mysql');


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

 




router.get('/things/:name/:id', function (req, res) {
    res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});


router.get('/users', function (req, res) {
    let sql = "SELECT * FROM users";
    let query = conn.query(sql, (err, results) => {
        if (err) {
            res.status(500).send("connection timedout");
        }
        else {
            res.status(200).send({ users: results });
        }
    });
});


router.post('/createuser', function (req, res) {
    let data = {
        name: req.body.name,
        state: req.body.state,
        nation: req.body.nation,
        schoolabbr: req.body.schoolabbr,
        position: req.body.position,
        profilephoto: req.body.profilephoto,
        username: req.body.username
    };
    let sql = `SELECT * FROM users WHERE username = '${req.body.username}'`;
    let fquery = conn.query(sql, (err, results) => {
        if(results.length > 0)
        {
            res.status(405).send({ success: false, msg: "Current user already exists" });
        }
        else
        {
            let sql_2 = "INSERT INTO users SET ?";
            let query = conn.query(sql_2, data, (err, results) => {
                if (err) { 
                    res.status(400).send({ success: false, msg: "User not created" });
                }
                else {
                    res.status(200).send({ success: true, msg: "User created successfully" });
                }
            });
        }
    });
});




/* router.post('/', function (req, res) {
    res.send('POST route on things.');
});
*/

//export this router to use in our index.js
module.exports = router;