"use strict";

//const SQSEventAppBuilder = require("./opt/SQSEventAppBuilder");
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
          jobId: "Job-Id",
          startDateTime: "123",
          dataSource: "dataSource",
          agIntegratedStubKey: "7484aaa8-6cb1-4669-9fa7-237f9473481a",
          fileId: "E632DD3A-105E-43E2-9F2B-A4DA0551AA93",
          nodeId: "7474",
          hashKey: "Hash-Key",
          fileName: "test.agdata",
          failedCount: 0
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
