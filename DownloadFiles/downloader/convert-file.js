const converter = require("../services/apis/agintegrated-converter");
const {
  queryTypes,
  executeQueryWithRetry
} = require("../services/couchbase/couchbase-utils");

const Logger = require("../shared/logger");
const STEP = "Convert File Using AgIntegrated Converter API";

async function convertFile(funcParams, fileURI) {
  try {
    let result = await converter.ConvertRaw(
      funcParams.agIntegratedStubKey,
      fileURI
    );

    await executeQueryWithRetry({
      queryType: queryTypes.Upsert,
      key: `convertedfile::${funcParams.dataSource}::${funcParams.nodeId}::${
        funcParams.fileId
      }`,

      value: {
        jobId: funcParams.jobId,
        dataSource: funcParams.dataSource,
        agIntegratedStubKey: funcParams.agIntegratedStubKey,
        nodeId: funcParams.nodeId,
        fileId: funcParams.fileId,
        hashKey: funcParams.hashKey,
        fileName: funcParams.fileName,
        trackingCode: result.data.tracking_code
      }
    });
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

module.exports = convertFile;
