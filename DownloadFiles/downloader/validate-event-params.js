const FailureError = require("../errors/FailureError");
const STEP = "Validate Event parameters";

async function validateEventParams(funcParams, logger) {
  if (
    !(
      funcParams.jobId &&
      funcParams.dataSource &&
      funcParams.agIntegratedStubKey &&
      funcParams.nodeId &&
      funcParams.fileId &&
      funcParams.hashKey &&
      funcParams.fileName
    )
  ) {
    let errorMessage =
      "missing one or more of event paramaters (jobId, startDateTime, dataSource, agIntegratedStubKey, nodeId, fileId, hashKey, fileName)";

    await logger.logError(errorMessage, STEP, funcParams);

    throw new FailureError(errorMessage);
  }
}

module.exports = validateEventParams;
