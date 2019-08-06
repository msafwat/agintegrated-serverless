// #region AgIntegrated Configuration
const agIntegratedConfig = {
  apiKey: process.env.AgIntegratedMasterKey,
  apiSecret: process.env.AgIntegratedSecret,
  baseurl: "https://sandbox.onsiteag.com",
  converterCallBack:
    "https://3gzy809og7.execute-api.us-east-1.amazonaws.com/develop/",
  converterAdaptor: "AgConnectionsGeoJson"
};
// #endregion

// #region CouchBase Configuration
const couchbaseConfig = {
  URL: "couchbase://rr-relax.landdb.com:8091/",
  bucketName: "agintegration-dev",
  clusterUserName: process.env.CouchBaseUserName,
  clusterPassword: process.env.CouchBasePassword
};

// #endregion

// #region Common Logging Configuration
const cloudwatchConfig = {
  commonLogGroupName: "agintegrated01-develop-lambda-failures",
  downloaderLogStream: "DownloadFiles"
};
// #endregion

// #region S3 Configuration
const s3Config = {
  agIntegratedBucketName: "agintegrated01-develop",
  agIntegratedRawFiles: "agintegrated-raw-files",
  expireDurationForSignedURI: 1800
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:agintegrated01-develop"
};
// #endregion

// #region SQS Configuration
const sqsConfig = {
  rawFilesLocationsQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/agintegrated01-develop-DownloadFiles"
};

// #endregion

module.exports = {
  agIntegratedConfig,
  couchbaseConfig,
  cloudwatchConfig,
  snsConfig,
  sqsConfig,
  s3Config
};
