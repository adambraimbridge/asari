/**
 * This project follows the example provided in the Yargs documentation for command hierarchy and directory structure.
 * @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
 */
exports.command = 'topics <subcommand> [...options]'
exports.desc = 'Manage GitHub topics'
exports.builder = function(yargs) {
	return yargs.commandDir('topics')
}
exports.handler = function() {}
