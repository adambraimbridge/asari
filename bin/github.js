#!/usr/bin/env node
const updateNotifier = require("update-notifier");
const yargs = require("yargs");
const yargsCommandsDirectoryPath = "../src/commands";
const { descriptions } = require('../lib/common-yargs')

/**
 * Configure yargs.
 *
 * @see http://yargs.js.org/docs/
 */
yargs
	/**
	 * Load our yargs command modules from a directory.
	 *
	 * @see https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
	 */
	.commandDir(yargsCommandsDirectoryPath)
	/**
	 * Set a usage message and description.
	 */
	.usage('$0 <command> <subcommand> [arguments]', 'Work with GitHub from the command line.')
	/**
	 * Maximize the width of yargs’ usage instructions.
	 */
	.wrap(yargs.terminalWidth())
	/**
	 * Always require a command to be specified.
	 */
	.demandCommand()
	/**
	 * Group global options in usage output.
	 */
	.group(["token", "json"], "Global Options:")
	.describe("token", descriptions.token)
	.describe("json", descriptions.json)
	/**
	 * Report unrecognized commands as errors.
	 */
	.strict()
	/**
	 * Enable the display of help with the `--help` option.
	 */
	.help();

/**
 * Parse command line arguments and handle them.
 *
 * Get yargs to parse Node's `process.argv` array and then handle them
 * e.g. display usage information, run a command module.
 *
 * @see https://nodejs.org/dist/latest/docs/api/process.html#process_process_argv
 */
yargs.parse();

/**
 * Display a notification if a newer version of this package is available to install.
 *
 * This check for updates to the `@financial-times/github` package
 * happens asynchronously in a detached child process that runs
 * independently from the parent CLI process. This ensures that
 * the check for updates doesn't interfere with the running of the
 * CLI itself. If an update is available, the user won't be notified
 * about it until the next time that they run the CLI.
 *
 * Note: `update-notifier` checks for updates once a day by default.
 *
 * @see https://www.npmjs.com/package/update-notifier
 */
const packageJson = require("../package.json");
updateNotifier({ pkg: packageJson }).notify();
