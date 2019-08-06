"use strict";

//const CloudWatchEventAppBuilder = require("./opt/CloudWatchEventAppBuilder");
const SQSEventAppBuilder = require("../services/SQSEventAppBuilder");

//exports.handler = async (event, context) => {
async function handler(event, context) {
  const app = new SQSEventAppBuilder(event, context, __dirname);
  app.addResiliencyService();
  app.addCouchbaseService();
  app.addSQSService();
  app.decorateLoggerWithNotifcation();
  await app.run();

  return app.output;
}

handler(
  {
    Records: [
      {
        messageId: "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
        receiptHandle: "MessageReceiptHandle",
        body: {
          dataSource: "DataSource-457aa9aa-561f-4ef1-b76f-66348961ebdb",
          agIntegratedStubKey: "dacfd8b4-f6af-4779-bd99-f1864630515c",
          jobId: 11,
          startDateTime: "2019-06-24T11:45:22.02Z"
        },
        attributes: {
          ApproximateReceiveCount: "1",
          SentTimestamp: "1523232000000",
          SenderId: "123456789012",
          ApproximateFirstReceiveTimestamp: "1523232000001"
        },
        messageAttributes: {},
        md5OfBody: "7b270e59b47ff90a553787216d55d91d",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:us-east-1:123456789012:MyQueue",
        awsRegion: "us-east-1"
      }
    ]
  },
  { awsRequestId: "12345" }
)
  .then(x => console.log(x))
  .catch(x => console.log(x));
