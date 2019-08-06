const apiUtilities = require("./shared/utilities");
const callAPIWithRetry = require("./shared/call-api-with-retry");

async function ListAvailableTelematics(userKey, services) {
  const { config } = services;

  const policies = config.policies;
  const agIntegratedConfig = config.agIntegratedConfig;

  let url = `${agIntegratedConfig.baseurl}/api/TelematicsNode/Tree`;
  let method = "GET";
  let result;
  try {
    let header = apiUtilities.generateRequestHeaders(
      method,
      url,
      userKey,
      agIntegratedConfig
    );

    result = await callAPIWithRetry(
      { url: url, method: method, header: header },
      policies.defaultAgIntegratedRetryPolicy
    );
    //console.log(result.elapsedTime);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  return result.data;
}

async function ListAvailableFilesFromTelematicNode(
  nodeID,
  created_before_date,
  created_after_date,
  userKey,
  config
) {
  const { agIntegratedConfig, policies } = config;

  let date_created_before_date = new Date(created_before_date);
  let date_created_after_date = new Date(created_after_date);

  if (date_created_before_date < date_created_after_date) {
    date_created_before_date.setDate(date_created_before_date.getDate() - 1); //subtract one day
  } else if (date_created_before_date > date_created_after_date) {
    throw new Error("Error: created_before_date > created_after_date");
  }

  created_before_date = date_created_before_date.toISOString();
  let url;
  if (created_after_date) {
    url = `${
      agIntegratedConfig.baseurl
    }/api/TelematicsNode/${nodeID}/Files?filters[created_after]=${created_after_date}&filters[created_before]=${created_before_date}`;
  } else {
    url = `${
      agIntegratedConfig.baseurl
    }/api/TelematicsNode/${nodeID}/Files?filters[created_before]=${created_before_date}`;
  }
  let method = "GET";
  let result;
  try {
    let header = apiUtilities.generateRequestHeaders(
      method,
      url,
      userKey,
      agIntegratedConfig
    );

    result = await callAPIWithRetry(
      { url: url, method: method, header: header },
      policies.defaultAgIntegratedRetryPolicy
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
  return result.data.data;
}

module.exports = {
  ListAvailableTelematics,
  ListAvailableFilesFromTelematicNode
};
