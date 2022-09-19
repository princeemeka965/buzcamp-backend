var express = require("express");
var app = express();
var cors = require("cors");
var sharp = require("sharp");
var path = require("path");
const { fromString } = require("uuidv4");
cookieParser = require("cookie-parser");
useragent = require("express-useragent");
require("dotenv").config();

//To parse URL encoded data
app.use(express.urlencoded({ extended: false }));

//To parse json data
app.use(express.json());

// cookie parser middleware
app.use(cookieParser());

//user-agent middleware
app.use(useragent.express());

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

const corsOptions = {
  origin: "*", //Your Client, do not write '*'
  credentials: true,
};
app.use(cors(corsOptions));

app.use(allowCrossDomain);

app.use(express.static("public"));
app.use("/images", express.static("public/media/t/v16"));

/**
 * Route to directories containing Endpoints
 */

var signUp = require("./authentication/signup.js");

var onBoard = require("./onboarding/init.js");

app.use("/authenticate", signUp);

app.use("/onboarding", onBoard);

// Other routes here
app.get("*", function (req, res) {
  res.status(404).send("Sorry, this is an invalid URL.");
});

app.listen(7000);
