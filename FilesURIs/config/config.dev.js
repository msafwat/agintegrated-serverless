// #region Policy Configuration

const policies = {
  defaultAgIntegratedRetryPolicy: {
    timeout: 30000,
    retry: 2,
    interval: 5000
  },
  defaultSQSRetryPolicy: {
    timeout: 5000,
    retry: 3,
    interval: 1000
  },
  defaultCouchBaseRetryPolicy: {
    timeout: 30000,
    retry: 2,
    interval: 5000
  }
};

// #endregion
const agIntegratedConfig = {
  apiKey: "1891d7f9-c6be-407b-b8e5-7dc709c747c4", //process.env.AgIntegratedMasterKey,
  apiSecret: "84c904e5-3460-49aa-aaac-a6acfbcaa982", //process.env.AgIntegratedSecret,
  baseurl: "https://sandbox.onsiteag.com"
};

// #region CouchBase Configuration
const couchbaseConfig = {
  URL: "couchbase://rr-relax.landdb.com:8091/",
  bucketName: "agintegration-dev",
  clusterUserName: process.env.CouchBaseUserName,
  clusterPassword: process.env.CouchBasePassword
};

// #endregion

const failureCount = 3;

// #region Common Logging Configuration
const cloudwatchConfig = {
  commonLogGroupName: "agintegrated01-develop-lambda-failures",
  fileURIsLogStream: "FileUris"
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:agintegrated01-develop"
};
// #endregion

// #region SQS Configuration
const sqsConfig = {
  fileURIsQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/agintegrated01-develop-FileUris"
};

// #endregion

module.exports = {
  policies,
  agIntegratedConfig,
  failureCount,
  couchbaseConfig,
  cloudwatchConfig,
  snsConfig,
  sqsConfig
};
