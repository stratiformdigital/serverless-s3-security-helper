"use strict";

const type = ["AWS::S3::Bucket"];

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      // This will ensure a properly configured serverless deployment bucket.
      "aws:deploy:deploy:createStack":
        this.configureBuckets.bind(this),

      // This will ensure proper configuration for all buckets.
      "before:deploy:deploy": this.configureBuckets.bind(this),
    };
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

  }
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
