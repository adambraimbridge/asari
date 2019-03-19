#!/usr/bin/env node

require("yargs")
	.commandDir("../src/commands")
	.demandCommand()
	.group(['token', 'json'], 'Global Options:')
	.strict()
	.help().argv;
