"use strict";

const validateEventParams = require("./validate-event-params");
const checkDuplicates = require("./check-duplicate");
const downloadFile = require("./download-file");
const UploadToS3 = require("./upload-to-s3");
const convertFile = require("./convert-file");
const sendFileURIToSQS = require("./send-to-sqs");

const {
  configureCouchbase,
  closeCouchbase
} = require("../services/couchbase/couchbase-utils");

async function handler(funcParams) {
  //validate needed event parameters
  await validateEventParams(funcParams);
  const uniqueFileName = `${funcParams.dataSource}::${funcParams.nodeId}::${
    funcParams.fileId
  }.agdata`;
  //open connection with couchbase
  await configureCouchbase();

  // #region check hashkey for duplication
  console.log(
    `Start Check hash Key for File ${uniqueFileName} for Duplication.`
  );

  let documentFound = await checkDuplicates(funcParams);

  console.log(`End Check hash Key for File ${uniqueFileName} for Duplication.`);

  if (documentFound) return;

  //#endregion

  // #region Downloading File
  console.log(`Start downloading File ${uniqueFileName}.`);

  let fileData = await downloadFile(funcParams);

  console.log(`End downloading File ${uniqueFileName}.`);

  // #endregion

  if (fileData) {
    // #region Uploading to S3 bucket and generate Signed URI
    console.log(
      `Start Uploading File ${uniqueFileName} To S3 bucket and generating Signed URI.`
    );

    let fileSignedURI = await UploadToS3(funcParams, fileData);
    console.log(fileSignedURI);
    console.log(
      `End Uploading File ${uniqueFileName} To S3 bucket and generating Signed URI.`
    );

    // #endregion

    // #region Calling AgIntegrated Converter API
    console.log(
      `Start Calling AgIntegrated Converter API For File ${uniqueFileName} And Save Tracking ID.`
    );

    await convertFile(funcParams, fileSignedURI);

    console.log(
      `End Calling AgIntegrated Converter API For File ${uniqueFileName} And Save Tracking Code.`
    );
    // #endregion

    // #region Send the Raw File Location To SQS
    // console.log(
    //   `Start Sending Location For File  ${uniqueFileName} To SQS.`
    // );

    // await sendFileURIToSQS(funcParams, fileSignedURI);

    // console.log(
    //   `End Sending Location For File  ${uniqueFileName} To SQS.`
    // );
    // #endregion
  }

  //close connection with couchbase
  await closeCouchbase();
}

module.exports = handler;
