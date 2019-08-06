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

/// #region CouchBase Configuration
const couchbaseConfig = {
  URL: "couchbase://rr-relax.landdb.com:8091/",
  bucketName: "agintegration-dev",
  clusterUserName: process.env.CouchBaseUserName,
  clusterPassword: process.env.CouchBasePassword
};

// #region Common Logging Configuration
const cloudwatchConfig = {
  commonLogGroupName: "agintegrated01-develop-lambda-failures",
  processFilesLogStream: "ProcessFiles"
};
// #endregion

// #region S3 Configuration
const s3Config = {
  agIntegratedBucketName: "agintegrated01-develop",
  agIntegratedConvertedFiles: "agintegrated-converted-files",
  expireDurationForSignedURI: 1800
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:agintegrated01-develop"
};
// #endregion

module.exports = {
  policies,
  couchbaseConfig,
  cloudwatchConfig,
  snsConfig,
  s3Config
};
