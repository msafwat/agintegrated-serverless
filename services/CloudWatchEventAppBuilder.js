const fs = require("fs");
const AppBuilder = require("./AppBuilder");

module.exports = class CloudWatchEventAppBuilder extends AppBuilder {
  constructor(event, context, dir, loadDefaultServices = true) {
    super(event, context, dir, loadDefaultServices);
  }

  constructData() {
    this.data = {
      jobId: this.context.awsRequestId,
      startDateTime: this.event.time
    };
  }

  setCorrelationId() {
    this.correlationId = this.context.awsRequestId;
  }

  handlerFactory() {
    this.validateEvent();

    const handlerFile = fs
      .readdirSync(this.dir)
      .filter(f => f.endsWith("handler.js"))[0];

    return require(`${this.dir}/${handlerFile}`).handler;
  }

  validateEvent() {
    if (this.event && this.event.source !== "aws.events") {
      throw new Error("invalid event");
    }
  }
};
