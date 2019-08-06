const STEP = "Get List of Failed Files";

exports.getListOfFailedFiles = async (services, data) => {
  const { config, logger, couchbase, retry } = services;

  const bucketName = config.COUCHBASE.BUCKET;
  const retryPolicy = config.policies.defaultCouchBaseRetryPolicy;

  try {
    // get files ids failed with failed count < 3 from couch base
    let query = `SELECT id, nodeId, failedCount, \`hash\` , name from \`${bucketName}\` WHERE META().id LIKE "failedfiles::${
      data.dataSource
    }%" AND failedCount < ${config.failureCount}`;

    let listofFailedFiles = await retry.retryWithCount(async () => {
      return await couchbase.executeQuery(query);
    }, retryPolicy);

    return listofFailedFiles;
  } catch (err) {
    logger.logException(err, STEP, data);
    throw exception;
  }
};
