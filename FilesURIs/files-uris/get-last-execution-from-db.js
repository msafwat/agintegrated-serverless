const STEP = "Get Last Execution From CouchBase";

exports.getLastExecution = async (services, data) => {
  const { config, logger, couchbase, retry } = services;

  const bucketName = config.COUCHBASE.BUCKET;
  const retryPolicy = config.policies.defaultCouchBaseRetryPolicy;

  try {
    const query = `SELECT LastExecution FROM \`${bucketName}\` WHERE META().id LIKE "checkpoint::${
      data.dataSource
    }"`;

    logger.logInfo("Start getLastExecutionFromDB/executeQueryWithRetry");
    let row = await retry.retryWithCount(async () => {
      return await couchbase.executeQuery(query);
    }, retryPolicy);
    logger.logInfo(
      `End getLastExecutionFromDB/executeQueryWithRetry ${row.LastExecution}`
    );

    if (row[0]) {
      return row[0].LastExecution;
    } else {
      return undefined;
    }
  } catch (exception) {
    logger.logException(err, STEP, data);
    throw exception;
  }
};
