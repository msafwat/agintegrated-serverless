"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: "us-east-1"
});

async function uploadToS3(bucketName, fileName, fileData) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileData,
      ContentType: "binary"
    };
    await s3.putObject(params).promise();
    console.log(
      `Successfully uploaded file ${fileName} to bucket ${bucketName}.`
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getSignedUrl(operation, bucketName, fileName, expireDuration) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: expireDuration
  };
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(operation, params, (err, url) => {
      err ? reject(err) : resolve(url);
    });
  });
}

module.exports = {
  uploadToS3,
  getSignedUrl
};
