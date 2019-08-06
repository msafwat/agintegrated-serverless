"use strict";

const processing = require("./processing/processing-handler");

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
      trackingCode: messagebody.tracking_code,
      status: messagebody.status,
      cpuHours: messagebody.cpu_hours,
      message: messagebody.message,
      resultURI: messagebody.result_url
    };

    if (funcParams.status && funcParams.status === "Error") {
      throw new FailureError(
        `File with tracking code ${
          funcParams.trackingCode
        } didn't converted .\n Error : ${funcParams.message}.`
      );
    } else {
      //Call downloader Business Handler
      await processing(funcParams);
    }
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
