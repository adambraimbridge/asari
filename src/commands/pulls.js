exports.command = 'pulls <command>'
exports.desc = 'Manage GitHub pull requests'
exports.builder = function (yargs) {
	return yargs.commandDir('pulls')
}
exports.handler = function () { }
