const FailureError = require("../shared/custom-errors");
const Logger = require("../shared/logger");
const STEP = "Validate Event parameters";

async function validateEventParams(funcParams) {
  if (
    !(
      funcParams.trackingCode &&
      funcParams.status &&
      funcParams.cpuHours &&
      // funcParams.message && [message should have the error when file not converted]
      funcParams.resultURI
    )
  ) {
    let errorMessage =
      "missing one or more of event paramaters (trackingCode, status, cpuHours, resultURI)";

    await Logger.error(STEP, errorMessage, funcParams);

    throw new FailureError(errorMessage);
  }
}

module.exports = validateEventParams;
