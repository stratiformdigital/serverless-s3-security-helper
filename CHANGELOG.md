# [4.0.0](https://github.com/stratiformdigital/serverless-s3-security-helper/compare/v3.3.0...v4.0.0) (2022-11-04)


### Features

* **require ssl:** Add 'require ssl' functionality to the plugin ([#31](https://github.com/stratiformdigital/serverless-s3-security-helper/issues/31)) ([28222e3](https://github.com/stratiformdigital/serverless-s3-security-helper/commit/28222e38e29c9dbe03e3b9fe48276c31e2fbb4b5))


### BREAKING CHANGES

* **require ssl:** Buckets with custom bucket policies need to be careful when upgrading to this version, as the 'require ssl' functionality will overwrite the custom policy unless that bucket is set to be 'skipped' by way of plugin configuration variables.  See docs!

# [3.3.0](https://github.com/stratiformdigital/serverless-s3-security-helper/compare/v3.2.1...v3.3.0) (2022-09-30)


### Features

* **block public:** Block all Public Access to buckets ([#20](https://github.com/stratiformdigital/serverless-s3-security-helper/issues/20)) ([6e20127](https://github.com/stratiformdigital/serverless-s3-security-helper/commit/6e20127b778fc6367a4efdd473d6b6dc326a3fb4))

## [3.2.1](https://github.com/stratiformdigital/serverless-s3-security-helper/compare/v3.2.0...v3.2.1) (2022-09-23)


### Bug Fixes

* **tests and bug:**  Add testing to the project ([#13](https://github.com/stratiformdigital/serverless-s3-security-helper/issues/13)) ([b055b7c](https://github.com/stratiformdigital/serverless-s3-security-helper/commit/b055b7cf1e68bace576a42b2c243968ffa93d456))

# [3.2.0](https://github.com/stratiformdigital/serverless-s3-security-helper/compare/v3.1.0...v3.2.0) (2022-07-14)


### Features

* **publish:**  Publish ([7a0db86](https://github.com/stratiformdigital/serverless-s3-security-helper/commit/7a0db86b07b0b5ad9a926686ebb81acb01d4083a))

# [3.1.0](https://github.com/stratiformdigital/serverless-s3-security-helper/compare/v3.0.0...v3.1.0) (2022-06-23)


### Features

* **migration:** migrate orgs ([c9eccf7](https://github.com/stratiformdigital/serverless-s3-security-helper/commit/c9eccf78fe26836e8162580dc429c691ffd5dcc7))

# [3.0.0](https://github.com/theclouddeck/serverless-s3-security-helper/compare/v2.3.0...v3.0.0) (2022-06-14)


### Features

* **sls v3:**  Update peer dependency specifying v3 ([9e8f0be](https://github.com/theclouddeck/serverless-s3-security-helper/commit/9e8f0be4145a3f17667e39a84eece9cd14b1e0ae))


### BREAKING CHANGES

* **sls v3:** specifying a sls v3 peer dep

# [2.3.0](https://github.com/theclouddeck/serverless-s3-security-helper/compare/v2.2.2...v2.3.0) (2022-06-08)


### Features

* **move org:** move to theclouddeck ([759ba48](https://github.com/theclouddeck/serverless-s3-security-helper/commit/759ba481b4a4647463e3a907a132acd791892bc2))

## [2.2.2](https://github.com/mdial89f/serverless-s3-security-helper/compare/v2.2.1...v2.2.2) (2022-04-23)


### Bug Fixes

* **metadata:** fix metadata ([5fbb28b](https://github.com/mdial89f/serverless-s3-security-helper/commit/5fbb28ba8c4573344ea4016f91755ad2cf7b8bc7))
* **metadata:** fix metadata ([ccebe8d](https://github.com/mdial89f/serverless-s3-security-helper/commit/ccebe8d5ad1c3e6780a9a1e05ae2faddfb425743))

## [2.2.1](https://github.com/mdial89f/serverless-s3-security-helper/compare/v2.2.0...v2.2.1) (2022-04-23)


### Bug Fixes

* **lock:** regen lock ([bf52879](https://github.com/mdial89f/serverless-s3-security-helper/commit/bf5287970e11d686be4da5f51b147009f812045b))

# [2.2.0](https://github.com/mdial89f/serverless-s3-security-helper/compare/v2.1.0...v2.2.0) (2022-04-23)


### Features

* **scope:** publish as scoped package ([2238e24](https://github.com/mdial89f/serverless-s3-security-helper/commit/2238e244c0278201f46539b37e709cc7134395f7))

# [2.1.0](https://github.com/mdial89f/serverless-s3-security-helper/compare/v2.0.0...v2.1.0) (2022-04-20)


### Features

* **publish fix:**  Update to fix publishing behavior ([0f06613](https://github.com/mdial89f/serverless-s3-security-helper/commit/0f06613b8f1dd02a5bd640cdce318c44cbd587b3))

# [2.0.0](https://github.com/mdial89f/serverless-s3-security-helper/compare/v1.1.0...v2.0.0) (2022-02-11)


### Features

* **license:**  update license ([#1](https://github.com/mdial89f/serverless-s3-security-helper/issues/1)) ([ef32051](https://github.com/mdial89f/serverless-s3-security-helper/commit/ef320514471d352ddd923a64956a00022f56c724))


### BREAKING CHANGES

* **license:** updating license

# [1.1.0](https://github.com/mdial89f/serverless-s3-security-helper/compare/v1.0.0...v1.1.0) (2022-01-18)


### Features

* **bootstrap:** bootstrap the project with structure and automation ([e118ad5](https://github.com/mdial89f/serverless-s3-security-helper/commit/e118ad57536e92d5c10abe2ea120f3b0321e15d7))
