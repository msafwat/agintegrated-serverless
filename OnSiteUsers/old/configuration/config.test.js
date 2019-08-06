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
//http://rr-relax.landdb.com:8091/
const couchbaseConfig = {
  URL: "couchbase://rr-relax.landdb.com:8091/",
  bucketName: "agintegration-dev",
  clusterUserName: process.env.CouchBaseUserName,
  clusterPassword: process.env.CouchBasePassword
};


// #endregion

// #region Common Logging Configuration
const cloudwatchConfig = {
  commonLogGroupName: "AgIntegrationLog",
  onsiteUsersLogStream: "OnSiteUsers",
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:AgIntegratedCommonLog"
};
// #endregion

// #region SQS Configuration
const sqsConfig = {
  onsiteUsersQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/onsite-users-test"
};

// #endregion

module.exports = {
  policies,
  couchbaseConfig,
  cloudwatchConfig,
  snsConfig,
  sqsConfig
};
