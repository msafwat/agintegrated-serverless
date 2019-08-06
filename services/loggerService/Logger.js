"use strict";

module.exports = class Logger {
  constructor(correlationId, apiRequestId, lambdaRequestId, functionName) {
    this.logMessage = {
      apiRequestId,
      lambdaRequestId,
      correlationId,
      functionName
    };
  }

  log(message, logType = LogType.INFO, subject = "", params = {}) {
    this.logMessage.logType = logType;
    this.logMessage.message = message;
    this.logMessage.subject = subject;
    this.logMessage.params = params;

    console.log(JSON.stringify(this.logMessage));
  }

  logInfo(message, subject = "", params = {}) {
    this.log(message, LogType.INFO, subject, params);
  }

  logWarning(message, subject = "", params = {}) {
    this.log(message, LogType.WARNING, subject, params);
  }

  logError(message, subject = "", params = {}) {
    this.log(message, LogType.ERROR, subject, params);
  }

  logException(err, subject = "", params = {}) {
    this.logError(
      err.toString() + (err.stack ? err.stack.toString() : ""),
      subject,
      params
    );
  }
};

const LogType = {
  INFO: "Info",
  WARNING: "Warning",
  ERROR: "Error"
};
