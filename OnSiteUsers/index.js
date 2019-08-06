"use strict";

//const CloudWatchEventAppBuilder = require("./opt/CloudWatchEventAppBuilder");
const CloudWatchEventAppBuilder = require("../services/CloudWatchEventAppBuilder");

//exports.handler = async (event, context) => {
async function handler(event, context) {
  const app = new CloudWatchEventAppBuilder(event, context, __dirname);
  app.addResiliencyService();
  app.addCouchbaseService();
  app.addSQSService();
  await app.run();

  return app.output;
}

// ********** Don't forget to remove **********
handler(
  {
    id: "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
    "detail-type": "Scheduled Event",
    source: "aws.events",
    account: "{{account-id}}",
    time: "2019-07-19T00:00:00Z",
    region: "us-east-1",
    resources: ["arn:aws:events:us-east-1:123456789012:rule/ExampleRule"],
    detail: {}
  },
  { awsRequestId: "1234", functionName: "OnSiteUsers" }
)
  .then(x => console.log(x))
  .catch(x => console.log(x));
