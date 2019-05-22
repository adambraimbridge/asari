/**
 * This project follows the example provided in the Yards documentation for command hierarchy and directory structure.
 * @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
 */
exports.command = 'issues <subcommand> [...options]'
exports.desc = 'Manage GitHub issues.'
exports.builder = function(yargs) {
	return yargs.commandDir('issues')
}
exports.handler = function() {}
