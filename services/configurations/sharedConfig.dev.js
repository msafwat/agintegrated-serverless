"use strict";

module.exports = {
  COUCHBASE: {
    URL: "couchbase://rr-relax.landdb.com:8091/",
    BUCKET: "agintegration-dev",
    USERNAME: "shaker.hussien", //process.env.COUCHBASE_USERNAME,
    PASSWORD: "YwB@6cbs69H7" //process.env.COUCHBASE_PASSWORD, //"MxRBQ@72#wP8",
  },
  AWS: {
    ACCOUNT_DATA: {
      ACCESS_KEY_ID: "AKIA6JHUVPVPTIDEDNMY", //process.env.AWS_ACCOUNT_DATA_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: "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", //process.env.AWS_ACCOUNT_DATA_SECRET_ACCESS_KEY,
      REGION: "us-east-1"
    }
  },
  policies: {
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
  }
};
