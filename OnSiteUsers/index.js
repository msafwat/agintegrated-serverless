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

// const onsiteUsers = require("./onsite-users/onsite-users-handler");

// const FailureError = require("./shared/custom-errors");
// const Logger = require("./shared/logger");
// const STEP = "Event Validation";

// let funcParams;
// try {
//   // #region Source Validation
//   funcParams = {
//     jobId: context.awsRequestId,
//     startDateTime: event.time
//   };

//   validateEvent(event);

//   // #endregion

//   //Call onsite-users Business Handler
//   await onsiteUsers(funcParams);
// } catch (error) {
//   if (error instanceof FailureError) {
//     await Logger.failure(
//       STEP,
//       JSON.stringify({ error: error.message, stack: error.stack }),
//       funcParams
//     );
//   } else {
//     Logger.error(
//       STEP,
//       JSON.stringify({ error: error.message, stack: error.stack }),
//       funcParams
//     );
//     //throw error;
//   }
// }
