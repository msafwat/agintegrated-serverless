"use strict";

const AWS = require("aws-sdk");

module.exports = class CloudWatchLogsService {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;

    // Set AWS Account Credentials.
    const AWSconfig = {
      accessKeyId: config.ACCOUNT_DATA.ACCESS_KEY_ID,
      secretAccessKey: config.ACCOUNT_DATA.SECRET_ACCESS_KEY,
      region: config.ACCOUNT_DATA.REGION
    };

    AWS.config.update({
      credentials: new AWS.Credentials(AWSconfig)
    });

    AWS.config.setPromisesDependency();

    this.cloudwatchLogs = new AWS.CloudWatchLogs({
      apiVersion: "2014-03-28",
      region: config.ACCOUNT_DATA.REGION
    });
  }

  async putLogsToCommonLogGroup(logMessage, logGroupName, logStreamName) {
    try {
      let logstreamData = await this.describeLogStreamsInCommonLogGroup(
        logGroupName,
        logStreamName
      );

      if (!logstreamData || logstreamData.length === 0) {
        throw new Error(
          `Failed to Get logStream Data for ${logGroupName} : ${logStreamName} to include next squence parameter in API.`
        );
      }

      let params = {
        logEvents: [
          {
            message: logMessage,
            timestamp: new Date().getTime()
          }
        ],
        logGroupName: logGroupName,
        logStreamName,
        sequenceToken: logstreamData.logStreams[0].uploadSequenceToken
      };

      await this.cloudwatchLogs.putLogEvents(params).promise();
    } catch (err) {
      this.logger.logException(err);
    }
  }

  async describeLogStreamsInCommonLogGroup(logGroupName, logStreamName) {
    try {
      let params = {
        logGroupName: logGroupName,
        logStreamNamePrefix: logStreamName,
        orderBy: "LogStreamName"
      };
      return await this.cloudwatchLogs.describeLogStreams(params).promise();
    } catch (err) {
      this.logger.logException(err);
    }
  }
};
