const s3 = require("../services/s3/s3-utils");
const { s3Config } = require("../configuration/config");

const rp = require("request-promise");

const Logger = require("../shared/logger");
const STEP = "Upload File to S3 bucket";

async function uploadConvertedFileToS3(funcParams, fileURI) {
  try {
    let result = await rp({
      url: decodeURIComponent(fileURI),
      method: "GET",
      encoding: null,
      time: true,
      resolveWithFullResponse: true
    });

    await s3.uploadToS3(
      s3Config.agIntegratedBucketName,
      `${s3Config.agIntegratedConvertedFiles}/${funcParams.dataSource}::${funcParams.nodeId}::${
        funcParams.fileId
      }.zip`,
      result.body
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

module.exports = uploadConvertedFileToS3;
