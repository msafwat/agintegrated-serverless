const AWS = require("aws-sdk");

module.exports = class SQSService {
  constructor(config, logger) {
    // Set AWS Account Credentials.
    const AWSconfig = {
      accessKeyId: config.ACCOUNT_DATA.ACCESS_KEY_ID,
      secretAccessKey: config.ACCOUNT_DATA.SECRET_ACCESS_KEY,
      region: config.ACCOUNT_DATA.REGION
    };

    AWS.config.update({
      credentials: new AWS.Credentials(AWSconfig)
    });

    AWS.config.setPromisesDependency();

    this.sqs = new AWS.SQS({
      apiVersion: "2012-11-05",
      region: config.ACCOUNT_DATA.REGION
    });

    this.logger = logger;
  }

  async addMessageToSQS(message, messageAttributes, queueUrl, delay = 0) {
    const params = {
      DelaySeconds: delay,
      MessageAttributes: messageAttributes,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl
    };

    return await this.sqs.sendMessage(params).promise();
  }
};

// const {
//   defaultSQSRetryPolicy
// } = require("../../configuration/config").policies;

// async function add_one_message_to_SQS_with_retry(
//   message,
//   messageAttributes = {},
//   queueName,
//   delay,
//   retry_policy
// ) {
//   //TODO: Time out of SQS sending is now depending on the default request timeout
//   let timeout = retry_policy.timeout;
//   let retries_number = retry_policy.retry;
//   let interval = retry_policy.interval;

//   let non_retryable_error = [];

//   let sqs = new AWS.SQS({ apiVersion: "2012-11-05", region: "us-east-1" });

//   let params = {
//     DelaySeconds: delay,
//     MessageAttributes: messageAttributes,
//     MessageBody: JSON.stringify(message),
//     QueueUrl: queueName
//   };

//   for (let i = 0; i < retries_number; i++) {
//     try {
//       result = await sqs.sendMessage(params).promise();
//       if (result.$response.httpResponse.statusCode === 200) {
//         console.log(
//           `message id ${result.MessageId} added to queue ${queueName}`
//         );
//         return result;
//       }
//     } catch (error) {
//       console.log(
//         `error: Exception Happened in retry number ${i +
//           1} while try to add message to SQS ${queueName}`,
//         `Error: ${error.message}`
//       );

//       if (error.message in non_retryable_error) return result;

//       if (i === retries_number - 1) {
//         throw error;
//       }
//     }
//   }
// }

// async function add_to_SQS_with_retry(
//   { messages, queueName, attributes },
//   retryPolicy = defaultSQSRetryPolicy
// ) {
//   sqsDelayRecieve = 0;

//   if (messages.length === 1) {
//     result = await add_one_message_to_SQS_with_retry(
//       messages[0],
//       attributes,
//       queueName,
//       sqsDelayRecieve,
//       retryPolicy
//     );
//   } else if (messages.length > 1) {
//     // sqs_delay_recieve = # messages (#retries* (timeout of one SQS send + interval between retries) ) + time to delete messages from the queue (in case of failure))
//     // sqs_delay_recieve = # messages (3*(30 +1) + time to delete messages)

//     //max delay allowed to recieve the message = 900 seconds (15 minutes)
//     /*sqsDelayRecieve =
//          ( messages.length *
//           (retryPolicy.retry * (retryPolicy.timeout + retryPolicy.interval) + 1))/1000;*/

//     sqsDelayRecieve = 0; //900;

//     //messages.forEach(async message => {
//     for (i in messages) {
//       try {
//         result = await add_one_message_to_SQS_with_retry(
//           messages[i],
//           attributes,
//           queueName,
//           sqsDelayRecieve,
//           retryPolicy
//         );
//       } catch (
//         error // All retries of one message failed
//       ) {
//         // Throw error and exit from foreach
//         throw error;
//       }
//     }
//   }
// }

// module.exports = { add_to_SQS_with_retry };
