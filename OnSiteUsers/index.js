"use strict";

const CloudWatchEventAppBuilder = require("./opt/CloudWatchEventAppBuilder");

exports.handler = async (event, context) => {
  const app = new CloudWatchEventAppBuilder(event, context, __dirname);
  app.addResiliencyService();
  app.addCouchbaseService();
  app.addSQSService();
  app.decorateLoggerWithNotifcation();
  await app.run();

  return app.output;
};
