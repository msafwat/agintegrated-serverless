"use strict";

const uuidv1 = require("uuid/v1");

const Config = require("./configService/config");
const Logger = require("./loggerService/Logger");
const Router = require("./routerService/Router");
const Response = require("./responseService/Response");
const Retry = require("./resiliencyService/Retry");
const Http = require("./httpService/AxiosService");
const CouchBaseApi = require("./couchbaseService/CouchBaseApi");
const S3 = require("./awsService/S3Service");
const SQS = require("./awsService/SQSService");
const SNS = require("./awsService/SNSService");
const CloudWatchLogs = require("./awsService/CloudWatchLogsService");

// Use AppBuilder to build and inject services and data to your Microservice Modules.
// The default implmentation is for API Gateway Events, if you like to support more events just extend it and enjoy.
module.exports = class AppBuilder {
  constructor(event, context, dir, loadDefaultServices = true) {
    this.event = event;
    this.context = context;
    this.dir = dir;

    // Builder Products
    this.services = {};
    this.data = {};
    this.output = {};

    // Defualt Diractor
    this.constructData();

    this.setCorrelationId();

    if (loadDefaultServices) {
      this.addConfigService();
      this.addLoggerService();
      this.addResponseService();
    }
  }

  addService(service) {
    const serviceKV = service(this.services);
    this.services[serviceKV.key] = serviceKV.service;
  }

  addConfigService() {
    if (!this.services.config)
      this.services.config = new Config(this.dir).load();
  }

  addLoggerService() {
    if (!this.services.logger) {
      const apiRequestId =
        this.event.requestContext && this.event.requestContext.requestId
          ? this.event.requestContext.requestId
          : uuidv1();

      const lambdaRequestId = this.context.awsRequestId;

      const functionName = this.context.functionName;

      this.services.logger = new Logger(
        this.correlationId,
        apiRequestId,
        lambdaRequestId,
        functionName
      );
    }
  }

  addResponseService() {
    if (!this.services.res)
      this.services.res = new Response(this.correlationId);
  }

  addResiliencyService() {
    if (!this.services.retry)
      this.services.retry = new Retry(this.services.logger);
  }

  addCouchbaseService() {
    if (!this.services.couchbase) {
      this.services.couchbase = new CouchBaseApi(
        this.services.config.COUCHBASE,
        this.services.logger
      );
    }
  }

  addAxiosService() {
    if (!this.services.http) this.services.http = new Http();
  }

  addS3Service() {
    if (!this.services.s3) {
      this.services.s3 = new S3(this.services.config.AWS, this.services.logger);
    }
  }

  addSQSService() {
    if (!this.services.sqs) {
      this.services.sqs = new SQS(
        this.services.config.AWS,
        this.services.logger
      );
    }
  }

  addSNSService() {
    if (!this.services.sns) {
      this.services.sns = new SNS(
        this.services.config.AWS,
        this.services.logger
      );
    }
  }

  addCloudWatchLogsService() {
    if (!this.services.cloudwatchLogs) {
      this.services.cloudwatchLogs = new CloudWatchLogs(
        this.services.config.AWS,
        this.services.logger
      );
    }
  }

  decorateLoggerWithNotifcation() {
    if (!this.services.logger) this.services.logger = this.addLoggerService();

    if (!this.services.logger.logExceptionAndNotify) {
      if (!this.services.sns) {
        this.addSNSService();
      }
      if (!this.services.cloudwatchLogs) this.addCloudWatchLogsService();

      this.services.logger.logExceptionAndNotify = async (
        err,
        subject = "",
        params = {},
        topicARN,
        logGroupName,
        logStream
      ) => {
        this.services.logger.logException(err, subject, params);

        const msgStr = JSON.stringify(this.services.logger.logMessage);

        await this.services.cloudwatchLogs.putLogsToCommonLogGroup(
          msgStr,
          logGroupName,
          logStream
        );

        await this.services.sns.sendMessageToTopic(msgStr, topicARN);
      };
    }
  }

  constructData() {
    if (this.event.pathParameters) this.data = { ...this.event.pathParameters };

    if (this.event.queryStringParameters)
      this.data = { ...this.data, ...this.event.queryStringParameters };

    if (this.event.headers && this.event.headers.Authorization) {
      this.data.authorization = this.event.headers.Authorization;
    }

    if (this.event.body) {
      let body = this.event.body;

      if (
        typeof this.event.body === "string" ||
        this.event.body instanceof String
      )
        body = JSON.parse(this.event.body);

      if (Array.isArray(body))
        this.data = {
          ...this.data,
          body: body
        };
      else this.data = { ...this.data, ...body };
    }
  }

  setCorrelationId() {
    if (this.event.headers && this.event.headers["x-correlation-id"])
      this.correlationId = this.event.headers["x-correlation-id"];
    else if (this.event.requestContext && this.event.requestContext.requestId)
      this.correlationId = this.event.requestContext.requestId;
    else this.correlationId = uuidv1();
  }

  handlerFactory() {
    return new Router(this.dir).route(this.event.path, this.event.httpMethod);
  }

  clean() {
    if (this.services.couchbase) this.services.couchbase.closeConnection();
  }

  async run() {
    const { logger, res } = this.services;

    try {
      const handler = this.handlerFactory();

      this.output = handler
        ? await handler(this.services, this.data)
        : res.notFound();

      this.clean();
    } catch (err) {
      logger.logException(err);
      this.output = res.internalServerError(err);
    }
  }
};
