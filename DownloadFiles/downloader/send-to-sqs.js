const sqsUtilities = require("../services/sqs/sqs-utils");
const { rawFilesLocationsQueue } = require("../configuration/config").sqsConfig;

const Logger = require("../shared/logger");
const STEP = "Send S3Location to File Converter SQS";

async function sendFileURIToSQS(funcParams, fileURI) {
  try {
    let rawFileLocation = fileURI;

    let messages = [{ ...funcParams, rawFileLocation }];
    let queueurl = rawFilesLocationsQueue;
    await sqsUtilities.add_to_SQS_with_retry({
      messages: messages,
      queueName: queueurl
    });
  } catch (error) {
    Logger.error(
      STEP,
      JSON.stringify({ error: error.message, stack: error.stack }),
      funcParams
    );
    throw error;
  }
}

module.exports = sendFileURIToSQS;
