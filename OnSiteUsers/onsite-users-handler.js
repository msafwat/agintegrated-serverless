const validateEventParams = require("./onsite-users/validate-event-params");
const { loadData } = require("./onsite-users/load-data");
const { sendUsersToSQS } = require("./onsite-users/send-to-sqs");
const FailureError = require("./errors/FailureError");

exports.handler = async (services, data) => {
  const { config, logger, res } = services;

  try {
    //Step-01 :Validate needed parameters in event
    await validateEventParams(data, logger);

    //Step-02 : Get Users AgIntegrated Keys From CouchBase
    logger.logInfo("Start loading AgIntegrated Keys for Landdb Users.");
    const users = await loadData(services, data);
    logger.logInfo("End loading AgIntegrated Keys for Landdb Users.");

    //Step-03 : Send Users to SQS Using SQS Retry Mechanism
    if (users && users.length > 0) {
      logger.logInfo("Start Adding Users to Onsite Users SQS.");
      await sendUsersToSQS(services, data, users);
      logger.logInfo("End Adding Users to Onsite Users SQS.");
    }

    return res.ok(JSON.stringify(users || {}));
  } catch (error) {
    if (error instanceof FailureError) {
      logger.logExceptionAndNotify(
        error,
        "OnSiteUsers",
        data,
        config.snsConfig.snsTopicARN,
        config.cloudwatchConfig.commonLogGroupName,
        config.cloudwatchConfig.onsiteUsersLogStream
      );
    } else {
      logger.logException(error);
    }

    return res.internalServerError(error);
  }
};
