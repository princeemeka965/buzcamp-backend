import express, { urlencoded, json } from "express";
var app = express();
import cors from "cors";
import sharp from "sharp";
import path from "path";
import { fromString } from "uuidv4";
import cookieParser from 'cookie-parser';

//To parse URL encoded data
app.use(urlencoded({ extended: false }));

//To parse json data
app.use(json());

// cookie parser middleware
app.use(cookieParser());


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
 * Route to authentication Endpoints
 */
import signUp from "./authentication/signup.js";

import verification from "./authentication/verification.js";

import login from "./authentication/login.js";

import passwordToken from "./authentication/password-token.js";


app.use("/authenticate/", signUp);

app.use("/authenticate/", verification);

app.use("/authenticate/", login);

app.use("/authenticate/", passwordToken);




/* import onBoard from "./onboarding/init.js";

app.use("/onboarding", onBoard);
*/

// Other routes here
app.get("*", function (req, res) {
  res.status(404).send("Sorry, this is an invalid URL.");
});

app.listen(7000);
