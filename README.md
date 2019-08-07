# AGIntegrated

AGIntegrated Serverless is the service for...

## How to create a new MicroService?

### Step 1: Add a new Function in template.yaml.

```yaml
# Microservices
CropRotationsFunction:
  Type: AWS::Serverless::Function
  Properties:
    FunctionName: CropRotationsFunction
    CodeUri: cropRotations/
```

**Note: CodeUri is the path for your microservice, it should be under the root directory of our app**

### step 2: Add AppBuilder to your index.js.

/cropRotations/index.js

```javascript
const AppBuilder = require("/opt/AppBuilder");

exports.handler = async (event, context) => {
  const app = new AppBuilder(event, context, __dirname);
  app.addAxiosService();
  await app.run();

  return app.output;
};
```

AppBuilder will handle routing, service injection and data mapping for you.

So far, we support those our services:

- app.addConfigService() // By defualt injected
- app.addLoggerService() // By defualt injected
- app.addResponseService() // By defualt injected
- app.addAxiosService()
- app.addCouchbaseService()
- app.addS3Service()

#### Add Middleware Service

If you like to inject a custom service, you can use addService middleware.

```javascript
app.addService(services => {
  const { config, logger, res, http } = services;

  // Some logic here.
  const ssurgoService = new ssurgoService(); // Instance of your custom service.

  return { key: "ssurgo", service: ssurgoService };
});
```

```javascript
// Now you can use it from your component.
exports.handler = async (services, data) => {
  const { config, logger, res, ssurgo } = services;
};
```

### Step 3: Create your component(s).

/cropRotations/retrieveCropRotations/index.js

```javascript
exports.handler = async (services, data) => {
  const { config, logger, res, http } = services;

  let result = await http.get(config.FTM.URL, config.FTM.AUTHORRIZATION);

  return res.ok(JSON.stringify(result.data));
};
```

### Step 4: Add your endpoint in apiGateway.openapi.json.

/services/configurations/apiGateway.openapi.json

```json
{
  "paths": {
    "/CropRotations": {
      "get": {
        "operationId": "retrieveCropRotations",
        "summary": "Returns FTM crop rotations.",
        "tags": ["Crop Rotation"],
        "responses": {
          "200": {
            "description": "Success.",
            "content": {
              "application/json": {
                "examples": {
                  "response": {
                    "value": {}
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error.",
            "content": {
              "application/json": {
                "examples": {
                  "response": {
                    "value": {}
                  }
                }
              }
            }
          }
        },
        "security": [
          {
            "okta_authorizer": []
          }
        ],
        "x-amazon-apigateway-integration": {
          "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:004443144924:function:CropRotationsFunction/invocations",
          "responses": {
            "default": {
              "statusCode": "200"
            }
          },
          "passthroughBehavior": "when_no_match",
          "httpMethod": "POST",
          "contentHandling": "CONVERT_TO_TEXT",
          "type": "aws_proxy"
        }
      }
    }
  }
}
```

**Important: operationId with component name like "operationId": "retrieveCropRotations", this how we route your comming request.**

**Second note set "x-amazon-apigateway-integration": { "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:004443144924:function:CropRotationsFunction/invocations", just change the CropRotationsFunction.**

**Last thing don't forget to set "security": [{ "okta_authorizer": [] } ]**

### Step 5: Add your private config, if needed.

/cropRotations/config/config.js

```javascript
"use strict";

module.exports = {
  FTM: {
    URL:
      "https://api.fieldtomarket.org/v3/ReferenceData/TillageManagementTemplates",
    AUTHORRIZATION: "Bearer EHo4NLXpxvfO2V5hMViMyEUroII8fo"
  }
};
```

**Note: when you recieve the config object from service it will automatically combine the shared and private configs for you.**

**Shared config: /services/configurations/sharedConfig.js**

### Services Overview

#### Logger Service

logger will be injected to your component by default, down here is how to use it.

```javascript
exports.handler = async (services, data) => {
  const { logger } = services;

  logger.logInfo("Info Message...");
  logger.logWarning("Warning Message");
  logger.logError("Error Message...");
  logger.logException(err);
};
```

log message: { apiRequestId, lambdaRequestId, correlationId, logType, message }

#### Response Service

```javascript
exports.handler = async (services, data) => {
  const { res } = services;

  return res.ok(JSON.stringify({ id: 1 }));
  return res.badRequest();
  return res.notFound();
  return res.internalServerError(err);
};
```

#### Configuration Service

```javascript
exports.handler = async (services, data) => {
  const { config } = services;

  let ftmUrl = config.FTM.URL.
};
```

#### Couchbase Service

```javascript
exports.handler = async (services, data) => {
  const { couchbase } = services;

  let key = "Assessment::xxxx::yyyy";
  let data = { name: "My Assessment" };

  await couchbase.insert(key, data);
  await couchbase.replace(key, data);
  await couchbase.read(key);
  await couchbase.keyStartsWith("Assessment::xxxx");
  await couchbase.executeQuery(
    "SELECT * FROM `bucket` data WHERE META().id LIKE '%::yyyy'"
  );
};
```

#### AppBuilder extension

You can extend AppBuilder to support differnet Event Sources. like SQS Events and CloudWatch Events, so on.

Sample of SQSEventAppBuilder:

```javascript
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
    this.validateEvent();

    const handlerFile = fs
      .readdirSync(this.dir)
      .filter(f => f.endsWith("handler.js"))[0];

    return require(`${this.dir}/${handlerFile}`).handler;
  }

  validateEvent() {
    if (
      !this.event.Records ||
      this.event.Records.length < 1 ||
      this.event.Records[0].eventSource !== "aws:sqs"
    ) {
      throw new Error("invalid event");
    }
  }
};
```

- constructData(). define the data building/mapping you like. for example Api Gateway mapp data from Query String, Path, Body and so on, however SQS events map from records.body.
- setCorrelationId(). generate or pass or map Correlation Id. Just note: I still not support Correlation Id passing from service to another.
- handlerFactory(). this where the handler loader should work. in Api Gateway it's the router that map the incomming request operationId to the handler. howerver in SQS we map it staticly to neighbour handler. Later I will support multi factory injection.

So far we support those Builders:

- AppBuilder (Default Api Gateway)
- CloudWatchEventAppBuilder
- SQSEventAppBuilder

## SAM Commands

```bash
$ sam validate

$ sam build

$ sam local invoke "CropRotationsFunction" -e "./cropRotations/addCropRotation/event.json"

$ sam local start-api

$ sam package --output-template-file packaged.yaml --s3-bucket sus-package-test

$ sam deploy --template-file packaged.yaml --stack-name sustainability --capabilities CAPABILITY_IAM --region us-east-1
```

## SAM Debug

```bash
$ sam local invoke -e "./cropRotations/retrieveCropRotations/event.json" --debug-port 5858 CropRotationsFunction

2019-07-27 20:41:25 Invoking index.handler (nodejs10.x)
2019-07-27 20:41:25 Found credentials in shared credentials file: ~/.aws/credentials
2019-07-27 20:41:25 DependenciesLayer is a local Layer in the template
2019-07-27 20:41:25 ServicesLayer is a local Layer in the template
2019-07-27 20:41:25 Building image...
2019-07-27 20:41:34 Requested to skip pulling images ...

2019-07-27 20:41:34 Mounting /Users/msafwat/Projects/sustainability-backend/cropRotations as /var/task:ro,delegated inside runtime container
Debugger listening on ws://0.0.0.0:5858/b7c69eea-7644-4135-837d-0af4010d603f
For help, see: https://nodejs.org/en/docs/inspector
```

.vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Crop Rotations",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 5858,
      // From the sam init example, it would be "${workspaceRoot}/hello_world"
      "localRoot": "${workspaceRoot}/cropRotations",
      "remoteRoot": "/var/task",
      "protocol": "inspector",
      "stopOnEntry": false
    },
    {
      "name": "Debug Assessment",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 5859,
      // From the sam init example, it would be "${workspaceRoot}/hello_world"
      "localRoot": "${workspaceRoot}/assessment",
      "remoteRoot": "/var/task",
      "protocol": "inspector",
      "stopOnEntry": false
    },
    {
      "name": "Debug Soil Characteristics",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 5860,
      // From the sam init example, it would be "${workspaceRoot}/hello_world"
      "localRoot": "${workspaceRoot}/soilCharacteristics",
      "remoteRoot": "/var/task",
      "protocol": "inspector",
      "stopOnEntry": false
    }
  ]
}
```

**Note: SAM has a bug here, it loads from /opt/node_module and can't recognize /opt/nodejs/node_module like invoke local, start api and package/deploy. So just for now you can copy node_module under dependencies folder but don't forget to remove it before deploy.**
