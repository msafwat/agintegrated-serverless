const STEP = "Update Last execution Time";

async function updateLastExecutionTime(services, data) {
  const { config, logger, couchbase, retry } = services;

  const retryPolicy = config.policies.defaultCouchBaseRetryPolicy;

  try {
    let key = `checkpoint::${data.dataSource}`;
    let value = `{ "AgIntegratedStubKey" : "${
      data.agIntegratedStubKey
    }", "LastExecution" : "${data.startDateTime}" }`;

    await retry.retryWithCount(async () => {
      return await couchbase.insert(key, value);
    }, retryPolicy);
  } catch (err) {
    logger.logException(err, STEP, data);
    throw exception;
  }
}

module.exports = updateLastExecutionTime;
