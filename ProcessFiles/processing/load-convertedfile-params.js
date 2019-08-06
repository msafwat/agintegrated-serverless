const {
  queryTypes,
  executeQueryWithRetry
} = require("../services/couchbase/couchbase-utils");
const {bucketName} =require('../configuration/config').couchbaseConfig;

const Logger = require("../shared/logger");
const FailureError = require("../shared/custom-errors");
const STEP = "Get Converted File parameters From CouchBase";

async function loadConvertedFileParams(funcParams) {
  try {
    const query = `select \`${bucketName}\`.* from \`${bucketName}\` where meta().id like "convertedfile%" and trackingCode="${
      funcParams.trackingCode
    }"`;

    let convertedFile = await executeQueryWithRetry({
      queryType: queryTypes.Query,
      query
    });

    return convertedFile;
  } catch (error) {
    Logger.error(
      STEP,
      JSON.stringify({ error: error.message, stack: error.stack }),
      funcParams
    );
    throw new FailureError(
      `Failed to get Converted File Parameters For File${
        funcParams.dataSource
      }::${funcParams.nodeId}::${funcParams.fileId}`
    );
  }
}

module.exports = loadConvertedFileParams;
