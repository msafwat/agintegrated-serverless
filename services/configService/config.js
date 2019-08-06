"use strict";

const fs = require("fs");

module.exports = class Config {
  constructor(lambdaDir) {
    this.lambdaDir = lambdaDir;
  }

  load() {
    let env = process.env.ENVIRONMENT;
    if (!env) env = "dev";
    else {
      if (env == "develop") env = "dev";
      else if (env == "production") env = "prod";
      else if (env == "release") env = "stage";
    }

    const sharedConfig = require(`../configurations/sharedConfig.${env}`);

    const lambdaConfigFile = `${this.lambdaDir}/config/config.${env}.js`;
    const lambdaConfig = fs.existsSync(lambdaConfigFile)
      ? require(lambdaConfigFile)
      : {};

    const allConfig = { ...sharedConfig, ...lambdaConfig };
    Object.freeze(allConfig);

    return allConfig;
  }
};
