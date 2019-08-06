const FailureError = require("../errors/FailureError");
const STEP = "Validate Event parameters";

async function ValidateEventParams(data, logger) {
  if (!data.jobId || !data.startDateTime) {
    const errorMessage =
      "missing one or more of event paramaters (jobId, startDateTime).";

    await logger.logError(errorMessage, STEP, data);
    throw new FailureError(errorMessage);
  }
}

module.exports = ValidateEventParams;
