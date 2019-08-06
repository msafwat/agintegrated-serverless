"use strict";

module.exports = {
  COUCHBASE: {
    URL: "",
    USERNAME: process.env.COUCHBASE_USERNAME,
    PASSWORD: process.env.COUCHBASE_PASSWORD, //"MxRBQ@72#wP8",
    BUCKET: ""
  },
  AWS: {
    DESTINATION_BUCKET: "",
    DESTINATION_BUCKET_URL: "",
    SOURCE_BUCKET: "",
    ACCOUNT_DATA: {
      ACCESS_KEY_ID: process.env.AWS_ACCOUNT_DATA_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.AWS_ACCOUNT_DATA_SECRET_ACCESS_KEY,
      REGION: ""
    }
  }
};
