#!/usr/bin/env node
const flow = require('lodash.flow')
const updateNotifier = require('update-notifier')
const yargs = require('yargs')
const yargsCommandsDirectoryPath = '../src/commands'
const commonYargs = require('../src/lib/common-yargs')

/**
 * Configure yargs.
 *
 * @see http://yargs.js.org/docs/
 */
const baseOptions = flow([
	// prettier-ignore
	commonYargs.withToken(),
	commonYargs.withJson(),
])
baseOptions(yargs)
	/**
	 * The --version argument only makes sense as an option for the main `github` command.
	 */
	.command('[--version]', 'Show the version number.')
	.hide('version')
	/**
	 * Load our yargs command modules from a directory.
	 *
	 * @see https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
	 */
	.commandDir(yargsCommandsDirectoryPath, { recurse: true })
	/**
	 * Maximize the width of yargs’ usage instructions.
	 */
	.wrap(yargs.terminalWidth())
	/**
	 * Show help if no command is specified, or on any error; making --help redundant.
	 */
	.demandCommand(1, '')
	.help(false)
	/**
	 * Group global options in usage output.
	 */
	.group(['token', 'json'], 'Global Options:')
	/**
	 * Report unrecognized commands as errors.
	 */
	.strict()

/**
 * Parse command line arguments and handle them.
 *
 * Get yargs to parse Node's `process.argv` array and then handle them
 * e.g. display usage information, run a command module.
 *
 * @see https://nodejs.org/dist/latest/docs/api/process.html#process_process_argv
 */
yargs.parse()

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
const packageJson = require('../package.json')
updateNotifier({ pkg: packageJson }).notify()
