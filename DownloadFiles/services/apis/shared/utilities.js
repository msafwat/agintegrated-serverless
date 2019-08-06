const crypto = require("crypto");

const { agIntegratedConfig } = require("../../../configuration/config");

async function generateRequestHeaders(method, url, userKey) {
  let unixTime = Math.floor(new Date().getTime() / 1000);
  let path = url
    .toString()
    .split("api/")[1]
    .split("?")[0];
  let signedParts = [
    method.toUpperCase(),
    path.toLowerCase(),
    unixTime.toString(),
    agIntegratedConfig.apiKey.toLowerCase(),
    userKey.toLowerCase()
  ].join("\r\n");

  let signature = crypto
    .createHmac("sha1", agIntegratedConfig.apiSecret)
    .update(signedParts)
    .digest()
    .toString("base64");

  return await {
    ["X-OS-APIKey"]: agIntegratedConfig.apiKey.toLowerCase(),
    ["X-OS-UserKey"]: userKey,
    ["X-OS-TimeStamp"]: unixTime,
    ["X-OS-Hash"]: signature,
    ["Accept"]: "application/json"
  };
}

module.exports = { generateRequestHeaders };
