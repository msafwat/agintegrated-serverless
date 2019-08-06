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

// #region AgIntegrated Configuration
const agIntegratedConfig = {
  apiKey: process.env.AgIntegratedMasterKey,
  apiSecret: process.env.AgIntegratedSecret,
  baseurl: "https://sandbox.onsiteag.com",
  converterCallBack:
    "https://n3jl634yf6.execute-api.us-east-1.amazonaws.com/dev/",
  converterAdaptor: "AgConnectionsGeoJson"
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
  downloaderLogStream: "Downloader"
};
// #endregion

// #region S3 Configuration
const s3Config = {
  agIntegratedBucketName: "agintegrated01",
  agIntegratedRawFiles: "agintegrated-raw-files",
  expireDurationForSignedURI: 1800
};
// #endregion

// #region SNS Configuration
const snsConfig = {
  snsTopicARN: "arn:aws:sns:us-east-1:981913140575:AgIntegratedCommonLog-dev"
};
// #endregion

// #region SQS Configuration
const sqsConfig = {
  rawFilesLocationsQueue:
    "https://sqs.us-east-1.amazonaws.com/981913140575/rawfiles-locations"
};

// #endregion

module.exports = {
  policies,
  agIntegratedConfig,
  couchbaseConfig,
  cloudwatchConfig,
  s3Config,
  snsConfig,
  sqsConfig
};
