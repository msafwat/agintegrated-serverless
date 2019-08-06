const couchbase = require("couchbase");

module.exports = class CouchBaseApi {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;

    this.cluster = new couchbase.Cluster(config.URL);
    this.cluster.authenticate(config.USERNAME, config.PASSWORD);

    this.bucket = this.cluster.openBucket(config.BUCKET);
  }

  insert(key, data) {
    return new Promise((resolve, reject) => {
      this.bucket.upsert(key, data, (err, result) => {
        if (err) {
          this.logger.logWarning(`Insert into Couchbase failed. Key (${key}).`);
          reject(err);
        } else {
          this.logger.logInfo(
            `Insert into Couchbase successfully. Key (${key}).`
          );
          resolve(result);
        }
      });
    });
  }

  replace(key, data) {
    return new Promise((resolve, reject) => {
      this.bucket.replace(key, data, (err, result) => {
        if (err) {
          this.logger.logWarning(`Replace key (${key}) into Couchbase failed.`);
          reject(err);
        } else {
          this.logger.logInfo(
            `Replace key (${key}) into Couchbase successfully.`
          );
          resolve(result);
        }
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this.bucket.remove(key, (err, result) => {
        if (err) {
          this.logger.log(`${key} delete from Couchbase failed.`);
          reject(err);
        } else {
          this.logger.log(`${key} Deleted from Couchbase successfully.`);
          resolve(result);
        }
      });
    });
  }

  read(key) {
    return new Promise((resolve, reject) => {
      key = key.toString();

      this.bucket.get(key, (err, result) => {
        if (err) {
          if (err.code == couchbase.errors.keyNotFound) {
            this.logger.logWarning(`Key (${key}) does not exist`);
            reject(err);
          } else {
            this.logger.logWarning(
              `Error occurred on retriving key (${key}) : ${JSON.stringify(
                err
              )}`
            );
            reject(err);
          }
        } else {
          this.logger.logInfo(
            `Retrieved (${key}) document with value: ${JSON.stringify(
              result.value
            )}`
          );
          this.logger.logInfo(`CAS is ${result.cas}`);
          resolve(result.value);
        }
      });
    });
  }

  getMulti(arrayOfKeys) {
    return new Promise((resolve, reject) => {
      this.bucket.getMulti(arrayOfKeys, (err, result) => {
        if (err) {
          if (err.code == couchbase.errors.keyNotFound) {
            this.logger.log("Key does not exist");
            reject(err);
          } else {
            this.logger.log("Some other error occurred: %j", err);
            reject(err);
          }
        } else {
          this.logger.log("Retrieved document with value: %j", result.value);
          this.logger.log("CAS is %j", result.cas);
          for (var key in results) {
            if (results.hasOwnProperty(key)) {
              if (results[key].error) {
                this.logger.log(
                  "`" + key + "`: " + JSON.stringify(results[key])
                );
              }
            }
          }
          resolve(result.value);
        }
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this.bucket.remove(key, (err, result) => {
        if (err) {
          this.logger.log(`${key} delete from Couchbase failed.`);
          reject(err);
        } else {
          this.logger.log(`${key} Deleted from Couchbase successfully.`);
          resolve(result);
        }
      });
    });
  }

  executeQuery(query) {
    return new Promise((resolve, reject) => {
      const nqlQuery = couchbase.N1qlQuery.fromString(query);
      this.bucket.query(nqlQuery, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  async keyStartsWith(part, alias = "data") {
    return await this.executeQuery(
      "SELECT *, META().id as objectKey FROM `" +
        this.config.BUCKET +
        "` AS " +
        alias +
        " WHERE META().id " +
        'LIKE "' +
        part +
        '%"'
    );
  }

  async closeConnection() {
    if (this.bucket) await this.bucket.disconnect();
  }
};
