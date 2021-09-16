# Serverless S3 Bucket Helper

This plugin sets settings on all S3 buckets. These are settings we generally want everywhere.

Currently,

- versioning is enabled for all buckets, regardless of configuration... non-negotiable
- public access is blocked via 'PublicAccessBlockConfiguration' by default.

## Usage

```
...

plugins:
  - serverless-s3-bucket-helper

...

```

## Background

This plugin has two hooks:

- package:createDeploymentArtifacts: This ensures the deployment bucket is configured correctly.
- package:compileEvents: This hook ensures all buckets built by the service are configured correctly.
