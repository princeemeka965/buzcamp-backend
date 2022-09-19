var express = require("express");
var session = require("express-session");
var router = express.Router();
var mysql = require("mysql");
var http = require("http");
var CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
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


router.post("/users", function (req, res, next) {
    console.log(JSON.stringify(req.headers));
    res.status(200).send({ success: true, subscribed: req.session.userId });
});

router.get("/agents", function (req, res) {
    res.status(200).send({ data: req.useragent });
});


res.cookie("_bz_meta_ip", `${req.sessionID}`, {
    expire: 864000000 + Date.now(),
});

module.exports = router;
