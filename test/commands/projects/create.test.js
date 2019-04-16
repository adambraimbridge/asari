const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/projects/create')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

jest.spyOn(global.console, 'warn')
jest.spyOn(global.console, 'log')
afterEach(() => {
	jest.clearAllMocks()
})

/**
 * Common Yargs tests
 */
const commandGroup = 'projects'
const command = 'create'
const requiredOptions = {
	'github-url': 'https://github.com/testowner/testrepository',
	name: 'test',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('StdIn-compatible options', () => {
	test(`Running the command handler without 'body' NOR 'stdin' throws an error`, async () => {
		expect.assertions(1)
		try {
			const optionString = Object.keys(requiredOptions)
				.map(option => `--${option} ${requiredOptions[option]}`)
				.join(' ')

			require('child_process').execSync(`./bin/github.js ${commandGroup} ${command} ${optionString}`)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('Body required.'))
		}
	})
	test(`Running the command handler with 'body' AND 'stdin' throws an error`, async () => {
		expect.assertions(1)
		try {
			const optionString =
				`--body body.txt ` +
				Object.keys(requiredOptions)
					.map(option => `--${option} ${requiredOptions[option]}`)
					.join(' ')

			require('child_process').execSync(`echo 'hello' | ./bin/github.js ${commandGroup} ${command} ${optionString}`)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('Too many body inputs.'))
		}
	})
	test(`Running the command handler with 'body' but WITHOUT 'stdin' throws an error — if the file is not found.`, async () => {
		expect.assertions(1)
		try {
			const optionString =
				`--body expect-file-not-found.txt ` +
				Object.keys(requiredOptions)
					.map(option => `--${option} ${requiredOptions[option]}`)
					.join(' ')

			require('child_process').execSync(`./bin/github.js ${commandGroup} ${command} ${optionString}`)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('File not found'))
		}
	})
	test(`Running the command handler with 'body' but WITHOUT 'stdin' does not throw an error — if the file IS found`, async () => {
		const optionString =
			`--body ./test/fixtures/body.txt ` +
			Object.keys(requiredOptions)
				.map(option => `--${option} ${requiredOptions[option]}`)
				.join(' ')

		const response = require('child_process').execSync(`./bin/github.js ${commandGroup} ${command} ${optionString}`)
		expect(response).toEqual(expect.stringContaining('hello'))
	})
	test.skip(`Running the command handler WITHOUT 'body' but with 'stdin' does not throw an error`, async () => {
		const optionString = Object.keys(requiredOptions)
			.map(option => `--${option} ${requiredOptions[option]}`)
			.join(' ')

		const response = require('child_process').execSync(`echo 'This is some test stdin body content' | ./bin/github.js ${commandGroup} ${command} ${optionString}`)
		expect(response).toEqual(expect.stringContaining('hello'))
	})
})

describe.skip('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/user/projects')
		.reply(200, {
			project_id: 1,
		})
		.post('/projects/1/columns')
		.times(3)
		.reply(200, {
			column_id: 1,
		})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(requiredOptions)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe.skip('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/orgs/test/projects')
		.reply(422, {
			message: 'Validation Failed',
			errors: [
				{
					resource: 'MockResource',
					code: 'custom',
					message: 'This is a mock error message.',
				},
			],
		})

	test('Output error responses that are returned from network requests of the GitHub API', async () => {
		await yargsModule.handler(requiredOptions)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
