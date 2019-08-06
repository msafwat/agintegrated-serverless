const apiUtilities = require("./shared/utilities");

const callAPIWithRetry = require("./shared/call-api-with-retry");

const {
  defaultAgIntegratedRetryPolicy
} = require("../../configuration/config").policies;

const { agIntegratedConfig } = require("../../configuration/config");

async function ConvertRaw(userKey, dataURI) {
  let url = `${agIntegratedConfig.baseurl}/api/Converter/Reader`;
  let method = "PUT";
  let data = `{
    "data_url": "${dataURI}",
    "callback_url": "${agIntegratedConfig.converterCallBack}",
    "output_adapter": "${agIntegratedConfig.converterAdaptor}"
  }`;
  let result;
  try {
    let header = await apiUtilities.generateRequestHeaders(
      method,
      url,
      userKey
    );

    result = await callAPIWithRetry(
      { url, method, data, header },
      defaultAgIntegratedRetryPolicy
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  ConvertRaw
};
