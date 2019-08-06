const FailureError = require("./errors/FailureError");
const validateParams = require("./files-uris/validate-params");
const { getLastExecution } = require("./files-uris/get-last-execution-from-db");
const getListOfFiles = require("./files-uris/get-list-of-files");
const {
  getListOfFailedFiles
} = require("./files-uris/get-list-of-failed-files");
const updateLastExecution = require("./files-uris/update-last-exeuction-time");
const addFilestoSQS = require("./files-uris/add-files-to-sqs");

exports.handler = async (services, data) => {
  const { config, logger, res } = services;

  try {
    //Get user stub key from SQS
    let messageBody = data[0];
    let agIntegratedStubKey = messageBody.agIntegratedStubKey;
    let dataSource = messageBody.dataSource;
    let jobId = messageBody.jobId;
    let startDateTime = messageBody.startDateTime;

    data = { dataSource, agIntegratedStubKey, jobId, startDateTime };

    let listOfAllFiles = [];
    await validateParams(data, logger);

    //Get last Successful execution from couch base
    logger.logInfo("Start getLastExecution ");
    let lastExecutionTime = await getLastExecution(services, data);
    logger.logInfo(`End getLastExecution ${lastExecutionTime}`);

    //Get List of Files
    logger.logInfo("Start getListOfFiles ");
    let listOfFiles = await getListOfFiles(lastExecutionTime, data, services);
    logger.logInfo(`End getListOfFiles ${listOfFiles}`);
    listOfAllFiles.push(...listOfFiles);

    //Get List of failed files
    logger.logInfo("Start getListOfFailedFiles ");
    let listofFailedFiles = await getListOfFailedFiles(services, data);
    logger.logInfo(`End getListOfFailedFiles ${listofFailedFiles}`);
    listOfAllFiles.push(...listofFailedFiles);

    //update last exeuction time
    logger.logInfo("Start updateLastExecution ");
    await updateLastExecution(services, data);
    logger.logInfo("End updateLastExecution ");

    // Add files to SQS
    if (listOfAllFiles) {
      logger.logInfo(`Start addFilestoSQS ${listOfAllFiles} `);
      await addFilestoSQS(listOfAllFiles, data, services);
      logger.logInfo("End addFilestoSQS ");
    }

    return res.ok(JSON.stringify(listOfAllFiles));
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
