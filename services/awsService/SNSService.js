"use strict";

const AWS = require("aws-sdk");

module.exports = class SNSService {
  constructor(config, logger) {
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

    this.sns = new AWS.SNS({
      apiVersion: "2010-03-31",
      region: config.ACCOUNT_DATA.REGION
    });
    this.logger = logger;
  }

  async sendMessageToTopic(message, topicARN) {
    const params = {
      TargetArn: topicARN,
      Message: message
    };

    return await this.sns.publish(params).promise();
  }
};
