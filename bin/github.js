#!/usr/bin/env node

const updateNotifier = require("update-notifier");

require("yargs")
	.commandDir("../src/commands")
	.demandCommand()
	.group(['token', 'json'], 'Global Options:')
	.strict()
	.help().argv;

const packageJson = require("../package.json");
updateNotifier({ pkg: packageJson }).notify();
