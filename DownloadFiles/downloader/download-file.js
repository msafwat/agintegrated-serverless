const telematics = require("../services/apis/agintegrated-telematics");
const Logger = require("../shared/logger");
const STEP = "Download File from telematics node";

const {
  queryTypes,
  executeQueryWithRetry
} = require("../services/couchbase/couchbase-utils");

//download files using API DownloadFileFromTelematicsNode
async function downloadFile(funcParams) {
  try {
    let result = await telematics.DownloadFileFromTelematicsNode(
      funcParams.agIntegratedStubKey,
      funcParams.nodeId,
      funcParams.fileId
    );

    return result;
  } catch (error) {
    Logger.error(
      STEP,
      JSON.stringify({ error: error.message, stack: error.stack }),
      funcParams
    );
    executeQueryWithRetry({
      queryType: queryTypes.Remove,
      key: `proccessedfile::${funcParams.dataSource}::${funcParams.hashKey}`
    });
    throw error;
  }
}

module.exports = downloadFile;
