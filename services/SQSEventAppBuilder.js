const fs = require("fs");
const AppBuilder = require("./AppBuilder");

module.exports = class SQSEventAppBuilder extends AppBuilder {
  constructor(event, context, dir, loadDefaultServices = true) {
    super(event, context, dir, loadDefaultServices);
  }

  constructData() {
    this.data = this.event.Records.map(r => r.body);
  }

  setCorrelationId() {
    this.correlationId = this.context.awsRequestId;
  }

  handlerFactory() {
    const handlerFile = fs
      .readdirSync(this.dir)
      .filter(f => f.endsWith("handler.js"))[0];

    return require(`${this.dir}/${handlerFile}`).handler;
  }
};
