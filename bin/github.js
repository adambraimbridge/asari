#!/usr/bin/env node

require("yargs")
	.commandDir("../src/commands")
	.demandCommand()
	.option("json", {
		type: "boolean"
	})
	.strict()
	.help().argv;
