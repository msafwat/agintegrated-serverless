const apiUtilities = require("./shared/utilities");
const callAPIWithRetry = require("./shared/call-api-with-retry");
const {
  defaultAgIntegratedRetryPolicy
} = require("../../configuration/config").policies;
const { baseurl } = require("../../configuration/config").agIntegratedConfig;

async function DownloadFileFromTelematicsNode(userKey, nodeID, fileID) {
  let url = `${baseurl}/api/TelematicsNode/${nodeID}/Files/${fileID}/`;
  let method = "GET";
  let result;
  try {
    let header = await apiUtilities.generateRequestHeaders(
      method,
      url,
      userKey
    );

    result = await callAPIWithRetry(
      { url: url, method: method, header: header, responseType: "stream" },
      defaultAgIntegratedRetryPolicy
    );

    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  DownloadFileFromTelematicsNode
};
