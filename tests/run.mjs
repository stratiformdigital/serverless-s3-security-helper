import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import LabeledProcessRunner from "./runner.mjs";
import {
  CloudFormationClient,
  paginateDescribeStacks,
  paginateListStackResources,
} from "@aws-sdk/client-cloudformation";
import {
  S3Client,
  GetBucketPolicyCommand,
  GetBucketVersioningCommand,
  GetPublicAccessBlockCommand,
} from "@aws-sdk/client-s3";
import _ from "lodash";
const runner = new LabeledProcessRunner();
const destroyer = new ServerlessStageDestroyer();
const region = process.env.REGION_A;
const project = process.env.PROJECT;

Array.prototype.diff = function (arr2) {
  return this.filter((x) => !arr2.includes(x));
};

async function getAllStacksForRegion(region) {
  const client = new CloudFormationClient({ region: region });
  const stacks = [];
  for await (const page of paginateDescribeStacks({ client }, {})) {
    stacks.push(...(page.Stacks || []));
  }
  return stacks;
}

async function getAllStacksForStage(region, stage) {
  return (await getAllStacksForRegion(region))
    .filter((i) => i.Tags?.find((j) => j.Key == "STAGE" && j.Value == stage))
    .filter((i) =>
      i.Tags?.find((j) => j.Key == "PROJECT" && j.Value == project)
    )
    .map((z) => z.StackName);
}

async function getBucketsForStack(region, stack) {
  const client = new CloudFormationClient({ region: region });
  const buckets = [];
  for await (const page of paginateListStackResources(
    { client },
    { StackName: stack }
  )) {
    // The spread operator was causing an error, so using a for loop
    for (let i of page.StackResourceSummaries || []) {
      if (i.ResourceType == "AWS::S3::Bucket") {
        buckets.push(i.PhysicalResourceId);
      }
    }
  }
  return buckets;
}

async function testSslIsEnforced(region, buckets) {
  const client = new S3Client({ region: region });
  var testName = "Bucket SSL enforced";
  for (const bucket of buckets) {
    try {
      var testName = "Bucket SSL enforced";
      var response = await client.send(
        new GetBucketPolicyCommand({
          Bucket: bucket,
        })
      );
      const sslIsEnforced = _.map(
        JSON.parse(response.Policy).Statement,
        (statement) => {
          return _.isEqual(_.omit(statement, "Sid"), {
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: [`arn:aws:s3:::${bucket}/*`, `arn:aws:s3:::${bucket}`],
            Condition: { Bool: { "aws:SecureTransport": "false" } },
          });
        }
      ).includes(true);
      if (sslIsEnforced) {
        console.log(`PASSED - ${testName} - ${bucket}`);
      } else {
        throw `FAILED - ${testName} - ${bucket}`;
      }
    } catch (error) {
      throw error;
    }
  }
}

async function testBucketVersioning(region, buckets) {
  const client = new S3Client({ region: region });
  var testName = "Bucket versioning enabled";
  for (const bucket of buckets) {
    try {
      var response = await client.send(
        new GetBucketVersioningCommand({
          Bucket: bucket,
        })
      );
      if (response.Status == "Enabled") {
        console.log(`PASSED - ${testName} - ${bucket}`);
      } else {
        throw `FAILED - ${testName} - ${bucket}`;
      }
    } catch (error) {
      throw error;
    }
  }
}

async function testBucketAccess(region, buckets) {
  const client = new S3Client({ region: region });
  var testName = "Bucket public access blocked";
  for (const bucket of buckets) {
    try {
      var response = await client.send(
        new GetPublicAccessBlockCommand({
          Bucket: bucket,
        })
      );
      const expectedPublicAccessBlockConfiguration = {
        BlockPublicAcls: true,
        IgnorePublicAcls: true,
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      };
      if (
        _.isEqual(
          response.PublicAccessBlockConfiguration,
          expectedPublicAccessBlockConfiguration
        )
      ) {
        console.log(`PASSED - ${testName} - ${bucket}`);
      } else {
        throw `FAILED - ${testName} - ${bucket}`;
      }
    } catch (error) {
      throw error;
    }
  }
}

try {
  // Deploy
  await runner.run_command_and_output(
    `deploy services`,
    ["sls", "deploy", "--stage", process.env.STAGE_NAME],
    "tests"
  );

  // Iterate over each stack created for this project and stage, although there should only be one.
  let stacks = await getAllStacksForStage(region, process.env.STAGE_NAME);
  for (const stack of stacks) {
    // Iterate over each bucket created for this stack.
    let buckets = await getBucketsForStack(region, stack);
    await testBucketVersioning(region, buckets);
    await testBucketAccess(region, buckets);
    await testSslIsEnforced(region, buckets);
  }
} catch (error) {
  throw error;
} finally {
  // Destroy
  // await destroyer.destroy(region, process.env.STAGE_NAME, {
  //   verify: false,
  //   wait: true,
  // });
}
