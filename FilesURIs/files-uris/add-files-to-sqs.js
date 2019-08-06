const STEP = "Add Files To SQS";

async function addFilestoSQS(listOfFiles, data, services) {
  const { config, logger, sqs, retry } = services;

  const queueUrl = config.sqsConfig.fileURIsQueue;
  const retryPolicy = config.policies.defaultSQSRetryPolicy;

  try {
    if (listOfFiles) {
      listOfFiles = listOfFiles.map(function(entry) {
        return {
          ...data,
          fileId: entry.id,
          nodeId: entry.nodeId,
          hashKey: entry.hash,
          fileName: entry.name,
          failedCount: entry.failedCount
        };
      });
    }

    for (i in listOfFiles) {
      try {
        await retry.retryWithCount(async () => {
          const result = await sqs.addMessageToSQS(
            listOfFiles[i],
            null,
            queueUrl
          );
        }, retryPolicy);
      } catch (
        error // All retries of one message failed
      ) {
        // Throw error and exit from foreach
        throw error;
      }
    }
  } catch (error) {
    logger.logException(error, STEP, data);

    throw error;
  }
}

module.exports = addFilestoSQS;
