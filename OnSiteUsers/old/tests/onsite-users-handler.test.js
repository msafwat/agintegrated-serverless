const { handler } = require("../../index");
const validateEventParams = require("../../onsite-users/validate-event-params");
const loadData = require("../../onsite-users/load-data");
const sendUsersToSQS = require("../../onsite-users/send-to-sqs");

const couchbaseUtility = require("../services/couchbase/couchbase-utils");

describe("validate cloucwatch event", () => {
  it("should throw exception when non cloudwatch event passed", async () => {
    let emptyEvent = {};
    let context = { awsRequestId: "awsRequestId" };
    try {
      await handler(emptyEvent, context);
    } catch (err) {
      expect(err.message).toEqual("invalid event");
    }
  });
});

describe("validate Parameters", () => {
  it("should throw exception when parameters passed with missing data", async () => {
    let cloudwatchEvent = {
      id: "event-id",
      "detail-type": "Scheduled Event",
      source: "aws.events",
      account: "account-id",
      time: "new Date()",
      region: "default-region",
      resources: ["arn:aws:events:us-east-1:123456789012:rule/ExampleRule"],
      detail: {}
    };
    let emptyContext = {};
    try {
      await validateEventParams(cloudwatchEvent, emptyContext);
    } catch (err) {
      expect(err.message).toEqual(
        "missing one or more of event paramaters (jobId, startDateTime)."
      );
    }
  });
});

describe("Load Users Data", () => {
  beforeEach(async () => {
    await couchbaseUtility.configureCouchbase();

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Upsert,
      key: "agintegratedkey::DataSource-01",
      value: {
        dataSource: "dataSource-01",
        agIntegratedStubKey: "agintegratedstubkey-01"
      }
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Upsert,
      key: "agintegratedkey::DataSource-02",
      value: {
        dataSource: "dataSource-02",
        agIntegratedStubKey: "agintegratedstubkey-02"
      }
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Upsert,
      key: "agintegratedkey::DataSource-03",
      value: {
        dataSource: "dataSource-03"
      }
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Upsert,
      key: "agintegratedkey::DataSource-04",
      value: {
        agIntegratedStubKey: "agintegratedstubkey-04"
      }
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Upsert,
      key: "agintegratedkey::DataSource-05",
      value: {}
    });
  });

  it("should get Ag integrated Users that has dataSource & agIntegratedStubkey ", async () => {
    let funcParams = {
      jobId: "job-Id",
      startDateTime: "new Date()"
    };
    let users = await loadData(funcParams);
    expect(users.length).toEqual(2);
    // expect.objectContaining({
    //   dataSource: expect.any(String),
    //   agIntegratedStubkey: expect.any(String)
    // })
  }, 30000);

  afterEach(async () => {
    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Remove,
      key: "agintegratedkey::DataSource-01"
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Remove,
      key: "agintegratedkey::DataSource-02"
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Remove,
      key: "agintegratedkey::DataSource-03"
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Remove,
      key: "agintegratedkey::DataSource-04"
    });

    await couchbaseUtility.executeQueryWithRetry({
      queryType: couchbaseUtility.queryTypes.Remove,
      key: "agintegratedkey::DataSource-05"
    });

    await couchbaseUtility.closeCouchbase();
  });
});
