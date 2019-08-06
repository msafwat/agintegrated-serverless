"use strict";

const downloader = require("./downloader/downloader-handler");

const FailureError = require("./shared/custom-errors");
const Logger = require("./shared/logger");
const STEP = "Event Validation";

exports.handler = async event => {
  let funcParams;
  try {
    // #region Source Validation

    validateEvent(event);

    // #endregion

    let messagebody = JSON.parse(event.Records[0].body);
    //let messagebody = event.Records[0].body;

    funcParams = {
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

    //Call downloader Business Handler
    await downloader(funcParams);
  } catch (error) {
    if (error instanceof FailureError) {
      await Logger.failure(
        STEP,
        JSON.stringify({ error: error.message, stack: error.stack }),
        funcParams
      );
    } else {
      Logger.error(
        STEP,
        JSON.stringify({ error: error.message, stack: error.stack }),
        funcParams
      );
    }
    throw error;
  }
};

function validateEvent(event) {
  if (
    !event.Records ||
    event.Records.length < 1 ||
    event.Records[0].eventSource !== "aws:sqs"
  ) {
    throw new FailureError("invalid event");
  }
}
