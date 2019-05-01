/* global expect */
const yargs = require('yargs')

const commandModuleExportsObject = (yargsModule, command) => {
	test(`The "${command}" command module exports an object that can be used by yargs`, () => {
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
const commandModuleCanLoad = (yargsModule, command) => {
	test(`yargs can load the "${command}" command without any errors or warnings`, () => {
		expect(() => {
			yargs.command(yargsModule).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})
}

/**
 * When testing <positional> vs. --optional arguments, positional arguments need to be at the beginning.
 * @param {object} requiredArguments
 */
const getTestArguments = requiredArguments => {
	const testArguments = []
	if (requiredArguments.positionals) {
		Object.keys(requiredArguments.positionals).forEach(argument =>
			testArguments.push({
				[argument]: requiredArguments.positionals[argument],
			})
		)
	}
	if (requiredArguments.options) {
		Object.keys(requiredArguments.options).forEach(argument =>
			testArguments.push({
				[argument]: `--${argument} ${requiredArguments.options[argument]}`,
			})
		)
	}
	return testArguments
}
/**
 * Test that each required argument will throw the expected error if it is missing.
 * @param {object} requiredArguments
 * @param {string} command
 */
const missingOptionWillThrow = (requiredArguments, command) => {
	// Testing the 'token' argument. Give execSync() env variables that do not include GITHUB_PERSONAL_ACCESS_TOKEN.
	const testEnv = Object.assign({}, process.env)
	delete testEnv.GITHUB_PERSONAL_ACCESS_TOKEN

	// Convert requiredArguments into an array, with positionals and options in the correct order.
	const testArguments = getTestArguments(requiredArguments)
	testArguments.forEach(argument => {
		const argumentName = Object.keys(argument)[0]
		test(`Running the command handler without ${argumentName} throws an error`, async () => {
			expect.assertions(1)
			try {
				const argumentString = testArguments
					.filter(a => Object.keys(a)[0] != argumentName)
					.map(a => Object.values(a)[0])
					.join(' ')

				/**
				 * Note: execSync() spawns a new process that nocks and mocks do not have access to.
				 * So you can only test for errors.
				 * If you test for successful execution, it will actually try to connect to GitHub.
				 */
				require('child_process').execSync(`./bin/github.js ${command} ${argumentString}`, { env: testEnv })
			} catch (error) {
				expect(error.message).toMatch(new RegExp(`Missing required argument:\(\[a\-z\\s\]\+\)${argumentName}`, 'i'))
			}
		})
	})
}
const describeYargs = (yargsModule, command, requiredArguments) => {
	jest.spyOn(global.console, 'warn')
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Yargs', () => {
		commandModuleExportsObject(yargsModule, command)
		commandModuleCanLoad(yargsModule, command)
		missingOptionWillThrow(requiredArguments, command)
	})
}
module.exports = {
	describeYargs,
}
