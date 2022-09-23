import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import LabeledProcessRunner from "./runner.mjs";
import {
  CloudFormationClient,
  paginateDescribeStacks,
  paginateListStackResources,
} from "@aws-sdk/client-cloudformation";
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
    .filter((i) => i.Tags?.find((j) => j.Key == "PROJECT" && j.Value == project))
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

try {
  // await runner.run_command_and_output(
  //   `deploy services`,
  //   ["sls", "deploy", "--stage", process.env.STAGE_NAME],
  //   "tests"
  // );

  // Iterate over each stack created for this project and stage, although there should only be one.
  let stacks = await getAllStacksForStage(region, process.env.STAGE_NAME);
  for(var i=0; i<stacks.length; i++) {
    
    // Iterate over each bucket created for this stack.
    let buckets = await getBucketsForStack(region, stacks[i]);
    for(var j=0; j<buckets.length; j++){

      console.log(`Testing bucket: ${buckets[j]}`);
      await testBucket(region, buckets[i]);
      
    }
  }

} catch (error) {
  throw error;
} finally {
  // await destroyer.destroy(region, process.env.STAGE_NAME, {
  //   verify: false,
  //   wait: true,
  // });
}

async function testBucket(region, bucket){
  console.log(region + bucket);
}


// // ------------------------------------------------
// console.log("\n\nChecking prod safeguard...");
// for (let stage of ["prod", "production", "fooprodbar"]) {
//   try {
//     await destroyer.destroy(region, stage, {});
//   } catch (err) {
//     if (!err.includes("You've requested a destroy for a protected stage")) {
//       throw "ERROR:  Production safeguard did not work as intended.";
//     }
//   }
// }
// console.log("Check passed...");
// // ------------------------------------------------

