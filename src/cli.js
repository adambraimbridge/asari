#!/usr/bin/env node

require("yargs")
	.commandDir("commands")
	.demandCommand()
	.option("json", {
		type: "boolean"
	})
	.strict()
	.help().argv;
