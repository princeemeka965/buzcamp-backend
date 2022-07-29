var express = require("express");
var session = require('express-session');
var router = express.Router();
var mysql = require("mysql");
var http = require("http");
var CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const axios = require("axios");
require('dotenv').config();


//create database connection
const conn = mysql.createConnection({
  host: "sql5.freesqldatabase.com",
  user: "sql5508259",
  password: "aHlVgvCI9I",
  database: "sql5508259",
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
  var sql =
    "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), nationality VARCHAR(255), state VARCHAR(255), gender VARCHAR(255), school VARCHAR(255), department VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255), userId VARCHAR(255), verification VARCHAR(255), token VARCHAR(255), tokenElapse VARCHAR(255))";
  conn.query(sql, function (err, result) {
    console.log("Table created");
  });
});


// cookie parser middleware
router.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;

router.use(session({
  secret: `${process.env.BUZCAMP_AUTH_ID}`,
  saveUninitialized: true,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    maxAge: oneDay
  },
  resave: false
}));



router.post("/createuser", function (req, res, next) {
  var name = CryptoJS.AES.decrypt(req.body.__user, 'my-secret-key@123');
  var decryptedName = name.toString(CryptoJS.enc.Utf8);

  var nation = CryptoJS.AES.decrypt(req.body.__rdNati, 'ecret-key@123');
  var decryptedNation = nation.toString(CryptoJS.enc.Utf8);

  var state = CryptoJS.AES.decrypt(req.body.__rdLoc, 'my-secret-key@123');
  var decryptedState = state.toString(CryptoJS.enc.Utf8);

  var gender = CryptoJS.AES.decrypt(req.body.__istGe, 'my-secret-key@123');
  var decryptedGender = gender.toString(CryptoJS.enc.Utf8);

  var school = CryptoJS.AES.decrypt(req.body.__isSch, 'my-secret-key@123');
  var decryptedSchool = school.toString(CryptoJS.enc.Utf8);

  var department = CryptoJS.AES.decrypt(req.body.__cmDept, 'my-secreets-key@123');
  var decryptedDepartment = department.toString(CryptoJS.enc.Utf8);

  var email = CryptoJS.AES.decrypt(req.body.__tmrMal, 'my-secret-key@123');
  var decryptedEmail = email.toString(CryptoJS.enc.Utf8);

  var username = CryptoJS.AES.decrypt(req.body.__bzuser, 'my-secret-key@23');
  var decryptedUsername = username.toString(CryptoJS.enc.Utf8);

  var password = CryptoJS.AES.decrypt(req.body.tCheck, 'my-secret-key@123');
  var decryptedPassword = password.toString(CryptoJS.enc.Utf8);

  var userId = CryptoJS.AES.decrypt(req.body.__chQP, 'buzy-my-secret-key@123');
  var decryptedUserId = userId.toString(CryptoJS.enc.Utf8);

  var tokenNo = Math.floor(10000 + Math.random() * 90000).toString();

  var currentTime = Math.floor(Date.now() / 1000);
  var tokenExpires = currentTime + (60 * 60).toString();

  let data = {
    name: decryptedName,
    nationality: decryptedNation,
    state: decryptedState,
    gender: decryptedGender,
    school: decryptedSchool,
    department: decryptedDepartment,
    email: decryptedEmail,
    username: decryptedUsername,
    password: decryptedPassword,
    userId: decryptedUserId,
    verification: '',
    token: tokenNo,
    tokenElapse: tokenExpires
  };

  session = req.session;
  session.userid = data.userId;

  let sql = `SELECT * FROM users WHERE username = '${data.username}'`;
  let fquery = conn.query(sql, (err, results) => {
    if (results.length > 0) {
      res
        .status(405)
        .send({ success: false, message: `User with username '${data.username}' already exists` });
    } else {

      let sql_2 = `INSERT INTO users (name, nationality, state, gender, school, department, email, username, password, userId, verification, token, tokenElapse) 
      VALUES ('${data.name}', '${data.nationality}', '${data.state}', '${data.gender}', '${data.school}', '${data.department}',
      '${data.email}', '${data.username}', '${data.password}', '${data.userId}', '${data.verification}', '${data.token}', '${data.tokenElapse}')`;

      let query = conn.query(sql_2, function (err, result) {
        if (err) {
          res.status(400).send({ success: false, message: "Error in creating User" });
        } else {
          res
            .status(200)
            .send({ success: true, message: "User created successfully", data: { __kTcLd: CryptoJS.AES.encrypt(`${tokenNo}`, 'my-secret-key@123').toString() } });

          const dataBody = {
            "personalizations": [
              {
                "to": [
                  {
                    "email": `${data.email}`
                  }
                ],
                "subject": "OTP for Account Verification"
              }
            ],
            "from": {
              "name": "Carrado",
              "email": "support@buzcamp.com"
            },
            "content": [
              {
                "type": "text/html",
                "value": "<div style=\"border: 1px solid #eee; width: 388px; padding: 46px 45px; margin: 50px auto\"><span style=\"margin-top: 20px; font-size: 18px\">Use the OTP below to validate your BuzCamp Account:</span><p style=\"margin-top: 10px; font-weight: bolder; font-size: 20px\">" + data.token + "</p><span style=\"margin-top: 13px; font-size: 18px\">This token will expire in an hour time. Please do not share this token with anyone.</span><span style=\"margin-top: 15px; font-size: 18px\">Thanks !<p style=\"font-size: 20px; font-weight: bolder\">BuzCamp</p></div>"
              }
            ]
          };

          const options = {
            method: 'POST',
            url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': 'd77e58d745msh315ac01c190b056p15860ajsnc32644a77641',
              'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
            },
            data: dataBody
          };

          axios.request(options).then(data => res.json(data))
            .catch(err => next(err));
        }
      });
    }
  });
});


router.post("/checkSubscription", function (req, res, next) {

  session = req.session;

  console.log(req.session);

  var currentTime = Math.floor(Date.now() / 1000).toString();
  var token = CryptoJS.AES.decrypt(req.body.__tkLd5a, 'my-secret-key@123');
  var decryptedToken = token.toString(CryptoJS.enc.Utf8);

  let sql = `SELECT * FROM users WHERE token = '${decryptedToken}'`;
  let fquery = conn.query(sql, (err, results) => {
    if (results.length > 0) {
      res
        .status(200)
        .send({ success: true, subscribed: true });
    } else {
      res
        .status(200)
        .send({ success: true, subscribed: false });
    }
  });
})

module.exports = router;
