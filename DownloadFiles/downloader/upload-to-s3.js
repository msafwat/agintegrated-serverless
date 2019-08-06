const s3 = require("../services/s3/s3-utils");
const { s3Config } = require("../configuration/config");

const Logger = require("../shared/logger");
const STEP = "Upload File to S3 bucket";

async function UploadToS3(funcParams, fileData) {
  try {
    await s3.uploadToS3(
      s3Config.agIntegratedBucketName,
      `${s3Config.agIntegratedRawFiles}/${funcParams.dataSource}::${funcParams.nodeId}::${
        funcParams.fileId
      }.agdata`,
      fileData
    );

    return await s3.getSignedUrl(
      "getObject",
      s3Config.agIntegratedBucketName,
      `${s3Config.agIntegratedRawFiles}/${funcParams.dataSource}::${funcParams.nodeId}::${
        funcParams.fileId
      }.agdata`,
      s3Config.expireDurationForSignedURI
    );
  } catch (error) {
    Logger.error(
      STEP,
      JSON.stringify({ error: error.message, stack: error.stack }),
      funcParams
    );

    throw error;
  }
}

module.exports = UploadToS3;
