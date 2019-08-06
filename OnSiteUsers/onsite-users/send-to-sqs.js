const FailureError = require("../errors/FailureError");

const STEP = "Send Users to SQS Using SQS";

exports.sendUsersToSQS = async (services, funcParams, users) => {
  const { config, logger, sqs, retry } = services;

  const queueUrl = config.sqsConfig.onsiteUsersQueue;
  const retryPolicy = config.policies.defaultSQSRetryPolicy;

  try {
    let messages = users.map(users => {
      return {
        jobId: funcParams.jobId,
        startDateTime: funcParams.startDateTime,
        dataSource: users.dataSource,
        agIntegratedStubKey: users.agIntegratedStubKey
      };
    });

    for (i in messages) {
      try {
        await retry.retryWithCount(async () => {
          const result = await sqs.addMessageToSQS(messages[i], null, queueUrl);
        }, retryPolicy);
      } catch (
        error // All retries of one message failed
      ) {
        // Throw error and exit from foreach
        throw error;
      }
    }
  } catch (error) {
    logger.logException(error, STEP, funcParams);
    throw new FailureError(
      `Failed to send message to SQS : ${config.sqsConfig.onsiteUsersQueue}`
    );
  }
};
