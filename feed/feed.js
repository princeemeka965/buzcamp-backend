var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var multer = require("multer");
var sharp = require("sharp");
var path = require("path");

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
});

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

const uploadFiles = upload.array("file", 5);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.file = [];
  await Promise.all(
    req.files.map(async (file) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `bz_${Date.now()}_${Math.floor(
        Math.random() * 10000000
      )}.jpeg`;

      await sharp(file.buffer)
        .resize(600)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .withMetadata()
        .toFile(`public/media/t/v16/${newFilename}`);

      req.body.file.push(`${newFilename}`);
    })
  );

  next();
};

const getResult = async (req, res) => {
  if (req.body.file.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  var bodyImages = [];
  req.body.file.map((image) => {
    // program to generate random strings

    // declare all characters
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_[$]&";

    function generateString(length) {
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    }

    bodyImages.push(`${image}?nc_id=600&bj_ndQ_v=${generateString(70)}`);
  });

  /*const images = bodyImages
        .map(image => "" + image + "")
        .join("");*/

  return res.status(200).json({
    status: "success",
    data: {
      gallery: bodyImages,
    },
  });
};

router.post("/create-media", uploadImages, resizeImages, getResult);

router.post("/create-status", (req, res) => {
  const files = req.body.mediaFiles.map((image) => "" + image + "").join(" ");

  let data = {
    posts: req.body.content,
    gallery: files,
    videoLength: req.body.duration,
    type: req.body.type,
  };

  let sql_2 = "INSERT INTO status SET ?";
  let query = conn.query(sql_2, data, (err, results) => {
    if (err) {
      res
        .status(400)
        .send({ success: false, message: "Error in posting status" });
    } else {
      res
        .status(200)
        .send({ success: true, message: "Your status has been posted" });
    }
  });
});

//export this router to use in our index.js
module.exports = router;
