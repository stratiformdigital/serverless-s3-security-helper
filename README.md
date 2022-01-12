# Serverless S3 Security Helper

This plugin set settings on all S3 buckets. These are settings we want everywhere.

Currently, it enables versioning.

## Usage

```
...

plugins:
  - serverless-s3-security-helper

...

```

## Background

This plugin has two hooks:

- package:createDeploymentArtifacts: This hook sets versioning on the sls deployment bucket.
- package:compileEvents: This hook sets versioning on all other buckets.

## License

CC0 1.0 Universal

This project stems from [CMSgov/serverless-s3-bucket-helper](https://github.com/cmsgov/serverless-s3-bucket-helper).  
This project is maintained and developed independently from [CMSgov/serverless-s3-bucket-helper](https://github.com/cmsgov/serverless-s3-bucket-helper), and is published with a CC0 1.0 Universal license.
