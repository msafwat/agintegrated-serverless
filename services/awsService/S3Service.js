const AWS = require("aws-sdk");

module.exports = class S3Service {
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

    this.s3 = new AWS.S3();
    this.logger = logger;
  }

  async copyThroughS3(srcBucket, srcKey, dstBucket) {
    return await this.s3
      .copyObject({
        CopySource: encodeURI(`/${srcBucket}/${srcKey}`),
        Bucket: dstBucket,
        Key: srcKey
      })
      .promise();
  }

  async upload(buket, key, body) {
    const params = {
      Bucket: buket,
      Key: key,
      Body: body
    };
    return await this.s3.upload(params).promise();
  }
};
