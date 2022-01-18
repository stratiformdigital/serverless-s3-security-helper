<h1 align="center" style="border-bottom: none;"> serverless-s3-security-helper</h1>
<h3 align="center">Sets security related settings on s3 buckets.</h3>
<p align="center">
  <a href="https://github.com/mdial89f/serverless-s3-security-helper/releases/latest">
    <img alt="latest release" src="https://img.shields.io/github/release/mdial89f/serverless-s3-security-helper.svg">
  </a>
  <a href="https://www.npmjs.com/package/serverless-s3-security-helper">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/serverless-s3-security-helper/latest.svg">
  </a>
  <a href="https://codeclimate.com/github/mdial89f/serverless-s3-security-helper/maintainability">
    <img alt="Maintainability" src="https://api.codeclimate.com/v1/badges/20f59ef91bd30565c424/maintainability">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
  <a href="https://dependabot.com/">
    <img alt="Dependabot" src="https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

## Usage

```
...

plugins:
  - serverless-s3-security-helper

...

```

## Background

This plugin set settings on all S3 buckets. These are settings that are commonly required for security compliance. It handles severless deployment buckets as well as buckets created by a service.

Currently, the plugin:

- enables versioning for objects
- blocks all public access on the bucket, by default

This plugin has two hooks:

- package:createDeploymentArtifacts: This hook sets versioning on the sls deployment bucket.
- package:compileEvents: This hook sets versioning on all other buckets.

## License

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

## Contributors

| [![Mike Dial][dial_avatar]][dial_homepage]<br/>[Mike Dial][dial_homepage] |
| ------------------------------------------------------------------------- |

[dial_homepage]: https://github.com/mdial89f
[dial_avatar]: https://avatars.githubusercontent.com/mdial89f?size=150
