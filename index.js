"use strict";
var _ = require("lodash");
const type = ["AWS::S3::Bucket"];

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      // This will ensure a properly configured serverless deployment bucket.
      "aws:deploy:deploy:createStack": this.configureBuckets.bind(this),

      // This will ensure proper configuration for all buckets.
      "before:deploy:deploy": this.configureBuckets.bind(this),
    };

    this.config = this.serverless.service.custom.s3SecurityHelper || {};

    var skipPolicyCreation = this.config.skipPolicyCreation || [];
    skipPolicyCreation.push("ServerlessDeploymentBucket");
    this.config.skipPolicyCreation = [...new Set(skipPolicyCreation)];
  }

  configureBuckets() {
    // Enable versioning.
    setPropertyForTypes.call(this, type, "VersioningConfiguration", {
      Status: "Enabled",
    });

    // Block all public access to the bucket.
    setPropertyForTypes.call(this, type, "PublicAccessBlockConfiguration", {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    });

    setPolicies.call(this);
  }
}

function setPolicies() {
  // Find all S3 Buckets in the CF template
  const template =
    this.serverless.service.provider.compiledCloudFormationTemplate;
  var buckets = [];
  _.forOwn(template.Resources, function (resource, name) {
    if (resource.Type == "AWS::S3::Bucket") {
      buckets.push(name);
    }
  });
  // For each bucket that isn't marked to be skipped for policy creation, make a policy
  buckets.forEach((bucket) => {
    if (!this.config.skipPolicyCreation.includes(bucket)) {
      template.Resources[`${bucket}BucketPolicy`] = {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          Bucket: {
            Ref: bucket,
          },
          PolicyDocument: {
            Statement: [
              {
                Sid: "RequireSecureTransport",
                Action: "s3:*",
                Effect: "Deny",
                Principal: "*",
                Resource: [
                  {
                    "Fn::Sub": `arn:\${AWS::Partition}:s3:::\${${bucket}}/*`,
                  },
                  {
                    "Fn::Sub": `arn:\${AWS::Partition}:s3:::\${${bucket}}`,
                  },
                ],
                Condition: {
                  Bool: {
                    "aws:SecureTransport": false,
                  },
                },
              },
            ],
          },
        },
      };
    }
  });
}

function setPropertyForTypes(types, property, value) {
  const template =
    this.serverless.service.provider.compiledCloudFormationTemplate;
  Object.keys(template.Resources).forEach(function (key) {
    if (types.includes(template.Resources[key]["Type"])) {
      template.Resources[key]["Properties"] =
        template.Resources[key]["Properties"] === undefined
          ? {}
          : template.Resources[key]["Properties"];
      template.Resources[key]["Properties"][property] = value;
    }
  });
}

module.exports = ServerlessPlugin;
