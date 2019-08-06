const {
  queryTypes,
  getDocumentById,
  executeQueryWithRetry
} = require("../services/couchbase/couchbase-utils");

const Logger = require("../shared/logger");
const STEP = "Check Duplicate";

//Check couchbase for hash using key 'proccessedfile::datasource::hash'
// if file hashkey found in Couchbase then return [duplicate]
// else save in couchbase

async function checkDuplicates(funcParams) {
  try {
    //check if the hash already in db
    let document = await getDocumentById(
      `proccessedfile::${funcParams.dataSource}::${funcParams.hashKey}`
    );

    if (document !== null) {
      Logger.info(
        STEP,
        `Duplicated Detected at job id : ${funcParams.jobId} for file : ${funcParams.dataSource}::${funcParams.nodeId}::${funcParams.fileId}.`,
        funcParams
      );

      return true;
    }

    await executeQueryWithRetry({
      queryType: queryTypes.Upsert,
      key: `proccessedfile::${funcParams.dataSource}::${funcParams.hashKey}`,
      value: {}
    });

    return false;
  } catch (error) {
    Logger.error(
      STEP,
      JSON.stringify({ error: error.message, stack: error.stack }),
      funcParams
    );
    throw error;
  }
}

module.exports = checkDuplicates;
