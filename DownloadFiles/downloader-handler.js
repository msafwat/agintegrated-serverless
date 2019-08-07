"use strict";

const FailureError = require("./errors/FailureError");
const validateEventParams = require("./downloader/validate-event-params");
const checkDuplicates = require("./downloader/check-duplicate");
const downloadFile = require("./downloader/download-file");
const UploadToS3 = require("./downloader/upload-to-s3");
const convertFile = require("./downloader/convert-file");
const sendFileURIToSQS = require("./downloader/send-to-sqs");

const {
  configureCouchbase,
  closeCouchbase
} = require("./services/couchbase/couchbase-utils");

exports.handler = async (services, data) => {
  const { config, logger, res } = services;

  try {
    let messagebody = data[0];
    //let messagebody = event.Records[0].body;

    data = {
      jobId: messagebody.jobId,
      startDateTime: messagebody.startDateTime,
      dataSource: messagebody.dataSource,
      agIntegratedStubKey: messagebody.agIntegratedStubKey,
      nodeId: messagebody.nodeId,
      fileId: messagebody.fileId,
      hashKey: messagebody.hashKey,
      fileName: messagebody.fileName,
      failedCount: messagebody.failedCount
    };

    //validate needed event parameters
    await validateEventParams(data, logger);
    const uniqueFileName = `${data.dataSource}::${data.nodeId}::${
      data.fileId
    }.agdata`;

    //open connection with couchbase
    await configureCouchbase();

    // #region check hashkey for duplication
    logger.logInfo(
      `Start Check hash Key for File ${uniqueFileName} for Duplication.`
    );

    let documentFound = await checkDuplicates(data);

    logger.logInfo(
      `End Check hash Key for File ${uniqueFileName} for Duplication.`
    );

    if (documentFound) return;

    //#endregion

    // #region Downloading File
    console.log(`Start downloading File ${uniqueFileName}.`);

    let fileData = await downloadFile(data);

    console.log(`End downloading File ${uniqueFileName}.`);

    // #endregion

    if (fileData) {
      // #region Uploading to S3 bucket and generate Signed URI
      console.log(
        `Start Uploading File ${uniqueFileName} To S3 bucket and generating Signed URI.`
      );

      let fileSignedURI = await UploadToS3(data, fileData);
      console.log(fileSignedURI);
      console.log(
        `End Uploading File ${uniqueFileName} To S3 bucket and generating Signed URI.`
      );

      // #endregion

      // #region Calling AgIntegrated Converter API
      console.log(
        `Start Calling AgIntegrated Converter API For File ${uniqueFileName} And Save Tracking ID.`
      );

      await convertFile(data, fileSignedURI);

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

    return res.ok(JSON.stringify({}));
  } catch (error) {
    if (error instanceof FailureError) {
      logger.logExceptionAndNotify(
        error,
        "OnSiteUsers",
        data,
        config.snsConfig.snsTopicARN,
        config.cloudwatchConfig.commonLogGroupName,
        config.cloudwatchConfig.onsiteUsersLogStream
      );
    } else {
      logger.logException(error);
    }

    return res.internalServerError(error);
  }
};
