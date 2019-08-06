const cloudwatchConfig = {
  commonLogGroupName: "agintegrated01-develop-lambda-failures",
  onsiteUsersLogStream: "OnSiteUsers"
};

const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:agintegrated01-develop"
};

const sqsConfig = {
  onsiteUsersQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/agintegrated01-develop-OnSiteUsers"
};

module.exports = {
  cloudwatchConfig,
  snsConfig,
  sqsConfig
};
