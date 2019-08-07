"use strict";

const SQSEventAppBuilder = require("./opt/SQSEventAppBuilder");

exports.handler = async (event, context) => {
  const app = new SQSEventAppBuilder(event, context, __dirname);
  app.addResiliencyService();
  app.addCouchbaseService();
  app.addSQSService();
  app.decorateLoggerWithNotifcation();
  await app.run();

  return app.output;
};
