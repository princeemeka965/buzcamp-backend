var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var http = require("http");
var CryptoJS = require("crypto-js");

//create database connection
const conn = mysql.createConnection({
  host: "db4free.net",
  user: "buzcamp",
  password: "+5k8Ww#Mv9SRQwN",
  database: "buzcamp_db",
});

//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
  var sql =
    "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), nationality VARCHAR(255), state VARCHAR(255), gender VARCHAR(255), school VARCHAR(255), schoolABBR VARCHAR(255), department VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255))";
  conn.query(sql, function (err, result) {
    console.log("Table created");
  });
});



router.post("/createuser", function (req, res) {
  var name = CryptoJS.AES.decrypt(req.body.__user, 'my-secret-key@123');
  var decryptedName = name.toString(CryptoJS.enc.Utf8);

  var nation = CryptoJS.AES.decrypt(req.body.__rdNati, 'my-secret-key@123');
  var decryptedNation = nation.toString(CryptoJS.enc.Utf8);

  var state = CryptoJS.AES.decrypt(req.body.__rdLoc, 'my-secret-key@123');
  var decryptedState = state.toString(CryptoJS.enc.Utf8);

  var gender = CryptoJS.AES.decrypt(req.body.__istGe, 'my-secret-key@123');
  var decryptedGender = gender.toString(CryptoJS.enc.Utf8);

  var school = CryptoJS.AES.decrypt(req.body.__isSch, 'my-secret-key@123');
  var decryptedSchool = school.toString(CryptoJS.enc.Utf8);

  var schoolabbr = CryptoJS.AES.decrypt(req.body.__isSch, 'my-secret-key@123');
  var decryptedAbbr = schoolabbr.toString(CryptoJS.enc.Utf8);

  var department = CryptoJS.AES.decrypt(req.body.__cmDept, 'my-secret-key@123');
  var decryptedDepartment = department.toString(CryptoJS.enc.Utf8);

  var email = CryptoJS.AES.decrypt(req.body.__tmrMal, 'my-secret-key@123');
  var decryptedEmail = email.toString(CryptoJS.enc.Utf8);

  var username = CryptoJS.AES.decrypt(req.body.__bzuser, 'my-secret-key@123');
  var decryptedUsername = username.toString(CryptoJS.enc.Utf8);

  var password = CryptoJS.AES.decrypt(req.body.tCheck, 'my-secret-key@123');
  var decryptedPassword = password.toString(CryptoJS.enc.Utf8);

  let data = {
    name: decryptedName,
    nation: decryptedNation,
    state: decryptedState,
    gender: decryptedGender,
    school: decryptedSchool,
    schoolABBR: decryptedAbbr,
    department: decryptedDepartment,
    email: decryptedEmail,
    username: decryptedUsername,
    password: decryptedPassword,
  };

  console.log(data);

  /* let sql = `SELECT * FROM users WHERE username = '${decryptedData.username}'`;
  let fquery = conn.query(sql, (err, results) => {
    if (results.length > 0) {
      res
        .status(405)
        .send({ success: false, msg: "Current user already exists" });
    } else {
      let sql_2 = "INSERT INTO users SET ?";
      let query = conn.query(sql_2, data, (err, results) => {
        if (err) {
          res.status(400).send({ success: false, msg: "Error in creating User" });
        } else {
          res
            .status(200)
            .send({ success: true, msg: "User created successfully" });
        }
      });
    }
  });
  */
});

module.exports = router;
