const FailureError = require("../errors/FailureError");
const STEP = "Validate Event parameters";

async function ValidateEventParams(funcParams, logger) {
  if (!funcParams.jobId || !funcParams.startDateTime) {
    const errorMessage =
      "missing one or more of event paramaters (jobId, startDateTime).";

    await logger.logError(errorMessage, STEP, funcParams);
    throw new FailureError(errorMessage);
  }
}

module.exports = ValidateEventParams;
