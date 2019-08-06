const { LAMBDA_FUNCTION_NAME, LOG_TYPES } = require("./constants");

const cloudwatchLogs = require("../services/cloudwatch-logs/cloudwatchlogs-utils");
const sns = require("../old/services/sns/sns-utils");

const { snsTopicARN } = require("../configuration/config").snsConfig;
const {
  onsiteUsersLogStream
} = require("../configuration/config").cloudwatchConfig;

async function failure(subject, message, params) {
  let logMessage = constructMessage(
    LOG_TYPES.FAILURE,
    subject,
    message,
    params
  );
  await cloudwatchLogs.putLogsToCommonLogGroup(
    onsiteUsersLogStream,
    logMessage
  );
  await sns.sendMessageToTopic(snsTopicARN, logMessage);
  console.error(logMessage);
}

function error(subject, message, params) {
  let logMessage = constructMessage(LOG_TYPES.ERROR, subject, message, params);
  console.error(logMessage);
}

function info(subject, message, params) {
  let logMessage = constructMessage(LOG_TYPES.INFO, subject, message, params);
  console.info(logMessage);
}

function constructMessage(type, subject, message, params = {}) {
  let subjectText =
    !subject || subject.trim().length < 1
      ? LAMBDA_FUNCTION_NAME
      : LAMBDA_FUNCTION_NAME + " - " + subject;

  let logMessage = {
    type,
    subject: subjectText,
    message,
    ...params
  };
  return JSON.stringify(logMessage);
}

module.exports = {
  failure,
  error,
  info
};
