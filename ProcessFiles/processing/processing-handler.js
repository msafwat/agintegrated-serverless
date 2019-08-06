"use strict";
const {
  configureCouchbase,
  closeCouchbase
} = require("../services/couchbase/couchbase-utils");

const validateEventParams = require("./validate-event-params");
const loadConvertedFileParams = require("./load-convertedfile-params");
const uploadConvertedFileToS3 = require("./upload-to-s3");

async function handler(funcParams) {
  await validateEventParams(funcParams);

  await configureCouchbase();
  let convertedFileParams = await loadConvertedFileParams(funcParams);
  await uploadConvertedFileToS3(convertedFileParams[0], funcParams.resultURI);
  await closeCouchbase();
}

module.exports = handler;
