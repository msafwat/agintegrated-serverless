"use strict";

module.exports = class Retry {
  constructor(logger) {
    this.logger = logger;
  }

  async retryWithCount(operation, policy) {
    let i = 1;
    while (i <= policy.retry) {
      try {
        return await operation();
      } catch (err) {
        this.logger.logWarning(
          `Operation faild on ${i} retry. ${err.toString()}. ${
            err.stack ? err.stack.toString() : ""
          }`
        );

        i++;
      }
    }

    throw new Error("All operation retries faild.");
  }

  async retryWithDelay(
    operation,
    count = 3,
    delayInSeconds = 60 * 3,
    delayIncrementalRatio = 1
  ) {}
};
