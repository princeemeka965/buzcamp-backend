var express = require("express");
var session = require("express-session");
var router = express.Router();
var mysql = require("mysql");
var http = require("http");
var CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const mysqlStore = require("express-mysql-session")(session);
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
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


router.get("/_ssoinit/:id", function (req, res) {
    const token = req.params.id;

    var decoded = jwt_decode(token);

    res.cookie("_bz_meta_ip", `${decoded.session}`, {
        expire: 864000000 + Date.now(),
    });

    let sql = `SELECT * FROM users WHERE verification = '${decoded.session}'`;
    conn.query(sql, (err, results) => {
        if (results.length > 0) {
            console.log(results);
           /* results.map((result) => {
                global.__bzUid = result.userId;
            });
            */
        }
    })
});

module.exports = router;
