import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import LabeledProcessRunner from "./runner.mjs";
import {
  CloudFormationClient,
  paginateDescribeStacks,
  paginateListStackResources,
} from "@aws-sdk/client-cloudformation";
import { S3Client, GetBucketVersioningCommand, GetPublicAccessBlockCommand } from "@aws-sdk/client-s3";
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

async function testBucket(region, bucket) {
  console.log(`Testing bucket: ${bucket}`);
  const client = new S3Client({ region: region });
  // ------------------------------------------------
  try {
    var testName = "Bucket versioning enabled";
    var response = await client.send(
      new GetBucketVersioningCommand({
        Bucket: bucket,
      })
    );
    if (response.Status == "Enabled") {
      console.log(`PASSED - ${testName}`);
    } else {
      throw `FAILED - ${testName}`;
    }
  } catch (error) {
    throw error;
  }
  // ------------------------------------------------

  // ------------------------------------------------
  try {
    var testName = "Bucket public access blocked";
    var response = await client.send(
      new GetPublicAccessBlockCommand({
        Bucket: bucket,
      })
    );
    const expectedPublicAccessBlockConfiguration = {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: true,
      RestrictPublicBuckets: true
    }
    if (_.isEqual(response.PublicAccessBlockConfiguration, expectedPublicAccessBlockConfiguration)) {
      console.log(`PASSED - ${testName}`);
    } else {
      throw `FAILED - ${testName}`;
    }
  } catch (error) {
    throw error;
  }
  // ------------------------------------------------
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
    for (const bucket of buckets) {
      await testBucket(region, bucket);
    }
  }
} catch (error) {
  throw error;
} finally {
  // Destroy
  await destroyer.destroy(region, process.env.STAGE_NAME, {
    verify: false,
    wait: true,
  });
}
