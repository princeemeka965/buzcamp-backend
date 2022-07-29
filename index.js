var express = require("express");
var session = require('express-session');
var app = express();
var sharp = require("sharp");
var path = require("path");
const { fromString } = require("uuidv4");
const cookieParser = require("cookie-parser");
require('dotenv').config();

//To parse URL encoded data
app.use(express.urlencoded({ extended: false }));

//To parse json data
app.use(express.json());

// cookie parser middleware
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
  secret: `${process.env.BUZCAMP_AUTH_ID}`,
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));


const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.use(express.static("public"));
app.use("/images", express.static("public/media/t/v16"));



/**
 * Route to directories containing Endpoints
 */

var signUp = require("./authentication/signup.js");

app.use("/authenticate", signUp);



// Other routes here
app.get("*", function (req, res) {
  res.status(404).send("Sorry, this is an invalid URL.");
});

app.listen(7000);
