/**
 * This project follows the example provided in the Yards documentation for command hierarchy and directory structure. 
 * @see: https://github.com/yargs/yargs/blob/master/docs/advanced.md#commanddirdirectory-opts
 */
exports.command = 'projects <command>'
exports.desc = 'Manage GitHub projects'
exports.builder = function (yargs) {
	return yargs.commandDir('projects')
}
exports.handler = function () { }
