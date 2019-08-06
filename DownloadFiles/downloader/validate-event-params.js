const FailureError = require("../shared/custom-errors");
const Logger = require("../shared/logger");
const STEP = "Validate Event parameters";

async function validateEventParams(funcParams) {
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

    await Logger.error(STEP, errorMessage, funcParams);

    throw new FailureError(errorMessage);
  }
}

module.exports = validateEventParams;
