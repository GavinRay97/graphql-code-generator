/// @ts-check
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const core = require('@actions/core');

async function main() {
  try {
    const token = core.getInput('npm-token');

    if (!token) {
      core.info('Skipping... Missing npm-token input');
      return;
    }

    try {
      fs.unlinkSync('out.txt');
    } catch (e) {}

    fs.writeFileSync('.npmrc', `//registry.npmjs.org/:_authToken=${token}`, {
      encoding: 'utf-8',
    });

    const output = execSync('npm run ci:release:canary > out.txt', {
      encoding: 'utf-8',
    });

    console.log(output);

    const version = output.match(/\@graphql-codegen\/plugin-helpers@([a-z0-9\.\-\+]+)/)[1];

    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(`Failed to release canary version: ${error.message}`);
  }
}

main();
