const FailureError = require("../errors/FailureError");
const STEP = "Validate Parameters";

async function validateParams(data, logger) {
  if (
    !(
      data.dataSource &&
      data.agIntegratedStubKey &&
      data.jobId &&
      data.startDateTime
    )
  ) {
    let errormessage =
      "missing one or more of event paramaters (dataSource, agIntegratedStubKey, jobId, startDateTime)";

    await logger.logError(errormessage, STEP, data);

    throw new FailureError(errormessage);
  }
}

module.exports = validateParams;
