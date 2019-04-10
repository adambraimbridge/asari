/* global expect */
const yargs = require("yargs")

const commandModuleExportsObject = (yargsModule, commandGroup, command) => {
	test(`The "${commandGroup} ${command}" command module exports an object that can be used by yargs`, () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringContaining(command),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})
}
const commandModuleCanLoad = (yargsModule, commandGroup, command) => {
	test(`yargs can load the "${commandGroup} ${command}" command without any errors or warnings`, () => {
		expect(() => {
			yargs.command(yargsModule).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})
}
const missingOptionWillThrow = (requiredOptions) => {
	for (let option of Object.keys(requiredOptions)) {
		test(`Running the command handler without '${option}' throws an error`, async () => {
			expect.assertions(1)
			try {
				const testOptions = Object.assign({}, requiredOptions)
				delete testOptions[option]

				const optionString = Object.keys(testOptions)
					.map(option => `--${option} ${testOptions[option]}`)
					.join(' ')

				require('child_process')
					.execSync(`./bin/github.js projects add-pull-request ${optionString}`)
			}
			catch (error) {
				expect(error.message).toEqual(expect.stringContaining(option))
			}
		})
	}
}
const describeYargs = (yargsModule, commandGroup, command, requiredOptions) => {
	describe("Yargs", () => {
		commandModuleExportsObject(yargsModule, commandGroup, command)
		commandModuleCanLoad(yargsModule, commandGroup, command)
		missingOptionWillThrow(requiredOptions)
	})
}
module.exports = {
	describeYargs,
}
