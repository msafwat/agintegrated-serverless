const FailureError = require("../errors/FailureError");

const STEP = "Get AgIntegrated Keys From CouchBase";

exports.loadData = async (services, data) => {
  const { config, logger, couchbase, retry } = services;

  const bucketName = config.COUCHBASE.BUCKET;
  const retryPolicy = config.policies.defaultCouchBaseRetryPolicy;

  try {
    let users = await retry.retryWithCount(async () => {
      return await couchbase.executeQuery(
        `SELECT \`${bucketName}\`.* FROM \`${bucketName}\` WHERE META().id LIKE "agintegratedkey%"`
      );
    }, retryPolicy);

    if (!users || users.length === 0) {
      logger.logInfo(`${STEP}: No users found. ${JSON.stringify(data)}`);
      return;
    }

    //check if user.dataSource && user.agIntegratedStubkey falsy or space
    let filteredUsers = users.filter(user => {
      let isValid =
        user.dataSource &&
        user.agIntegratedStubKey &&
        user.dataSource.trim().length > 0 &&
        user.agIntegratedStubKey.trim().length > 0;

      if (!isValid) {
        logger.logInfo(
          `Data Source or User StubKey not found/empty in DB.\n Data saved : ${JSON.stringify(
            user
          )}. `,
          STEP,
          data
        );
      }

      return isValid;
    });

    return filteredUsers;
  } catch (err) {
    logger.logException(err, STEP, data);

    throw new FailureError(
      "Failed to get Users StubKeys From CouchBase Instance."
    );
  }
};
