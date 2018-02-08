#! /usr/bin/env node
const argv = require('yargs').argv
const communicator = require('../lib/codestrate-communicator');

const port = argv.port || 1974;

// open communication on defined port
communicator.open(port);

console.log(`Codestrate to node service is running on port ${port}`);