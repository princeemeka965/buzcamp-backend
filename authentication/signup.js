var express = require("express");
var session = require("express-session");
var router = express.Router();
var mysql = require("mysql");
var http = require("http");
var CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const mysqlStore = require("express-mysql-session")(session);
require("dotenv").config();

const IN_PROD = process.env.NODE_ENV === "production";
const TWO_HOURS = 1000 * 60 * 60 * 4;

const options = {
  connectionLimit: 2000,
  password: process.env.BUZCAMP_DB_PASSWORD,
  user: process.env.BUZCAMP_DB_USER,
  database: process.env.BUZCAMP_DB,
  host: process.env.BUZCAMP_DB_HOST,
  createDatabaseTable: true,
};

//create database connection
const conn = mysql.createPool(options);
const sessionStore = new mysqlStore(options, conn);

router.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: TWO_HOURS,
      sameSite: false,
      secure: IN_PROD,
    },
  })
);

//connect to database
var sql =
  "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), nationality VARCHAR(255), state VARCHAR(255), gender VARCHAR(255), school VARCHAR(255), department VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255), userId VARCHAR(255), verification VARCHAR(255), token VARCHAR(255), tokenElapse VARCHAR(255))";
conn.query(sql, function (err, result) {
  if (result) {
    console.log("Table created");
  } else if (err) {
    console.log(err);
  }
});

router.post("/createuser", function (req, res, next) {
  var name = CryptoJS.AES.decrypt(req.body.__user, "my-secret-key@123");
  var decryptedName = name.toString(CryptoJS.enc.Utf8);

  var nation = CryptoJS.AES.decrypt(req.body.__rdNati, "ecret-key@123");
  var decryptedNation = nation.toString(CryptoJS.enc.Utf8);

  var state = CryptoJS.AES.decrypt(req.body.__rdLoc, "my-secret-key@123");
  var decryptedState = state.toString(CryptoJS.enc.Utf8);

  var gender = CryptoJS.AES.decrypt(req.body.__istGe, "my-secret-key@123");
  var decryptedGender = gender.toString(CryptoJS.enc.Utf8);

  var school = CryptoJS.AES.decrypt(req.body.__isSch, "my-secret-key@123");
  var decryptedSchool = school.toString(CryptoJS.enc.Utf8);

  var department = CryptoJS.AES.decrypt(
    req.body.__cmDept,
    "my-secreets-key@123"
  );
  var decryptedDepartment = department.toString(CryptoJS.enc.Utf8);

  var email = CryptoJS.AES.decrypt(req.body.__tmrMal, "my-secret-key@123");
  var decryptedEmail = email.toString(CryptoJS.enc.Utf8);

  var username = CryptoJS.AES.decrypt(req.body.__bzuser, "my-secret-key@23");
  var decryptedUsername = username.toString(CryptoJS.enc.Utf8);

  var password = CryptoJS.AES.decrypt(req.body.tCheck, "my-secret-key@123");
  var decryptedPassword = password.toString(CryptoJS.enc.Utf8);

  var userId = CryptoJS.AES.decrypt(req.body.__chQP, "buzy-my-secret-key@123");
  var decryptedUserId = userId.toString(CryptoJS.enc.Utf8);

  var tokenNo = (Math.floor(Math.random() * 10000) + 90000).toString();

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
    verification: "",
    token: tokenNo,
    tokenElapse: tokenExpires,
  };

  let sql = `SELECT * FROM users WHERE username = '${data.username}'`;
  let fquery = conn.query(sql, (err, results) => {
    if (results.length > 0) {
      res.status(405).send({
        success: false,
        message: `User with username '${data.username}' already exists`,
      });
    } else {
      let sql_2 = `INSERT INTO users (name, nationality, state, gender, school, department, email, username, password, userId, verification, token, tokenElapse) 
      VALUES ('${data.name}', '${data.nationality}', '${data.state}', '${data.gender}', '${data.school}', '${data.department}',
      '${data.email}', '${data.username}', '${data.password}', '${data.userId}', '${data.verification}', '${data.token}', '${data.tokenElapse}')`;

      let query = conn.query(sql_2, function (err, result) {
        if (err) {
          res
            .status(400)
            .send({ success: false, message: "Error in creating User" });
        } else {
          res.status(200).send({
            success: true,
            message: "Account created successfully",
            data: {
              __kTcLd: CryptoJS.AES.encrypt(
                `${tokenNo}`,
                "my-secret-key@123"
              ).toString(),
            },
          });

          const dataBody = {
            personalizations: [
              {
                to: [
                  {
                    email: `${data.email}`,
                  },
                ],
                subject: "OTP for Account Verification",
              },
            ],
            from: {
              name: "Carrado",
              email: "support@buzcamp.com",
            },
            content: [
              {
                type: "text/html",
                value:
                  '<div style="border: 1px solid #eee; width: 388px; padding: 46px 45px; margin: 50px auto"><span style="margin-top: 20px; font-size: 18px">Use the OTP below to validate your BuzCamp Account:</span><p style="margin-top: 10px; font-weight: bolder; font-size: 20px">' +
                  data.token +
                  '</p><span style="margin-top: 13px; font-size: 18px">This token will expire in an hour time. Please do not share this token with anyone.</span><span style="margin-top: 15px; font-size: 18px">Thanks !<p style="font-size: 20px; font-weight: bolder">BuzCamp</p></div>',
              },
            ],
          };

          const options = {
            method: "POST",
            url: `${process.env.EMAIL_API}`,
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key":
                "d77e58d745msh315ac01c190b056p15860ajsnc32644a77641",
              "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
            },
            data: dataBody,
          };

          axios
            .request(options)
            .then((data) => res.json(data))
            .catch((err) => next(err));
        }
      });
    }
  });
});

router.post("/verifyAccount", function (req, res, next) {
  var currentTime = Math.floor(Date.now() / 1000).toString();

  var token = req.body.__tkLd5a;

  var userId = "";

  let sql = `SELECT * FROM users WHERE token = '${token}' AND tokenElapse < '${currentTime}'`;
  let fquery = conn.query(sql, (err, results) => {
    results.forEach((result) => {
      userId = result.userId;
    });

    if (results.length > 0) {
      let sql_1 = `UPDATE users SET verification = '${req.sessionID}', token = '', tokenElapse = '' WHERE userId = '${userId}'`;
      conn.query(sql_1);

      let sql_2 = `INSERT INTO sessions (session_id, expires, data) 
      VALUES ('${req.sessionID}', '${
        req.session.cookie.originalMaxAge
      }', '${JSON.stringify(req.session)}')`;
      let query = conn.query(sql_2, function (err, result) {
        if (err) {
          res.status(405).send({
            success: false,
            subscribed: false,
            message: "Error in validating OTP",
          });
        } else {
          res.cookie("_bz_meta_ip", `${req.sessionID}`, {
            expire: 864000000 + Date.now(),
          });
          res.status(200).send({
            success: true,
            subscribed: true,
          });
        }
      });
    } else {
      res.status(405).send({
        success: false,
        subscribed: false,
        message: "OTP entered is invalid",
      });
    }
  });
});

router.post("/users", function (req, res, next) {
  console.log(JSON.stringify(req.headers));
  res.status(200).send({ success: true, subscribed: req.session.userId });
});

router.get("/agents", function (req, res) {
  res.cookie("name", "express").send("cookie set");
  // res.status(200).send({ data: req.useragent });
});

module.exports = router;
