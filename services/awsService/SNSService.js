"use strict";

const AWS = require("aws-sdk");

module.exports = class SNSService {
  constructor(config) {
    this.config = config;

    this.sns = new AWS.SNS({
      apiVersion: "2010-03-31",
      region: "us-east-1"
    });
  }

  sendMessageToTopic = async (logMessage, topicARN) => {
    const params = {
      TargetArn: topicARN,
      Message: logMessage
    };

    return await sns.publish(params).promise();
  };
};
