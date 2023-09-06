const { S3 } = require("aws-sdk")
require("dotenv").config();
const uuid = require("uuid").v4;
// const uuid = require('uuid').v4
const CircularJSON = require('circular-json')

exports.s3Uploadv2 = async (files) => {
    const s3 = new S3();
  
    const params = files.map((file) => {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${file.originalname}`,
        Body: file.buffer,
      };
    });
  
    return await Promise.all(params.map((param) => s3.upload(param).promise()));

  };

  exports.s3Uploadv2pdf = async (files) => {
    const s3 = new S3();
  
    const params = files.map((file) => {
      return {
        Bucket: file.Bucket,
        Key: file.Key,
        Body: file.Body,
        ContentEncoding: file.ContentEncoding, // required
        contentType: file.contentType,
      };
    });
    return await s3.upload(params).promise();

  };

  exports.s3Getv2 = () => {
    const s3 = new S3();
    s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "aws-heretto"
      },function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Body.toString());
      }
    })
  };

  exports.s3ListAllBucketv2 = async () => {
    const s3 = new S3();
 
    await s3.listBuckets(async function(err, data) {
      if (err) {
        console.log("Error", err);
        return err
      } else {
        console.log("Success", data.Buckets);
        return data.Buckets
      }
    })
  };

  
  exports.s3ListObjectv2 = async () => {
    const s3 = new S3();
  
    await s3.listObjects({Bucket: process.env.AWS_BUCKET_NAME},async function(err, data) {
      if (err) {
        console.log("Error", err);
        return err
      } else {
        console.log("Success", data);
        return data
      }
    })
  };