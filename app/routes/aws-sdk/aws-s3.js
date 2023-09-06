const express = require('express')
const cors = require("cors");
const router = express.Router()

const multer = require('multer')
const { s3Uploadv2, s3Getv2, s3ListAllBucketv2, s3ListObjectv2, s3Uploadv2pdf } = require("../../services/aws-sdk/aws-s3");
const { S3 } = require("aws-sdk")
const uuid = require("uuid").v4;
const path =  require("path");
const fs = require("fs");
const app = express()
app.use(cors());
require("dotenv").config()
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};


const upload = multer({
storage,
// fileFilter,
limits: { fileSize: 1000000000, files: 2 },
});


// List of all bucket in s3
router.get('/listAllBuckets', async(req, res)=> {
  const s3 = new S3();

  await s3.listBuckets(async function(err, data) {
    if (err) {
    console.log("Error", err);
    res.send(err)
    } else {
    console.log("Success", data.Buckets);
    res.send(data.Buckets)
    }
  })
})

// Get file content inside bucket
router.get('/getBucket', async(req, res)=> {
const s3 = new S3();
    s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "838e0140-7dca-4138-bd19-97ab43833a28-testfile2.txt"
    },function(err, data) {
    if (err) {
        console.log("Error", err);
        res.send(err)
    } else {
        console.log("Success", data.Body.toString());
        res.send(data)
    }
    })
})

// List of all file/ folder inside bucket
router.get('/listObject', async(req, res)=> {
    const s3 = new S3();
    
      await s3.listObjects({Bucket: process.env.AWS_BUCKET_NAME},async function(err, data) {
        if (err) {
          console.log("Error", err);
          res.send(err)
        } else {
          console.log("Success", data);
          res.send(data)
        }
      })
  })
  

router.post('/s3upload', upload.array("file"), async(req, res)=> {
  const s3 = new S3();
  
    const params = req.files.map((file) => {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${file.originalname}`,
        Body: file.buffer,
      };
    });
  
    await Promise.all(params.map((param) => s3.upload(param).promise().then((data)=> {
      console.log(data)
      res.send(data)
    })));
})

// upload file in s3
router.post('/uploadpdf', async(req, res)=> {
  const s3 = new S3();
  try {
    var base64code = Buffer.from(req.body.content, "base64")

    var params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: req.body.key,
          Body: base64code
        }
      var resdata =  s3.upload(params).promise()
      res.send(resdata)
  }
  catch(err){
    res.send(err)
  }
})

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "file is too large",
        });
      }
  
      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          message: "File limit reached",
        });
      }
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          message: "File must be an image",
        });
      }
    }
  });

module.exports = router