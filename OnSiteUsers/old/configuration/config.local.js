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

// #region CouchBase Configuration

//couchbase local config
const couchbaseConfig = {
  URL: "couchbase://localhost/",
  bucketName: "sample",
  clusterUserName: "ShakerHussien",
  clusterPassword: "Selem_2018"
};

// #endregion

// #region Common Logging Configuration
const cloudwatchConfig = {
  commonLogGroupName: "AgIntegrationLog-dev",
  onsiteUsersLogStream: "OnSiteUsers",
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:AgIntegratedCommonLog-dev"
};
// #endregion

// #region SQS Configuration
const sqsConfig = {
  onsiteUsersQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/onsite-users"
};

// #endregion

module.exports = {
  policies,
  couchbaseConfig,
  cloudwatchConfig,
  snsConfig,
  sqsConfig
};
