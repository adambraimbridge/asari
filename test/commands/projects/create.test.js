const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/projects/create')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

jest.spyOn(global.console, 'log')
afterEach(() => {
	jest.clearAllMocks()
})

/**
 * Common Yargs tests
 */
const command = 'projects create'
const requiredArguments = {
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo',
	},
	options: {
		token: 'Test-Token',
		name: 'TestProject',
		body: './test/fixtures/body.txt', // Note: This fixture file is intended to exist.
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

// Todo: Add a test for options with spaces, e.g. { name: 'Test Project' }

describe('StdIn-compatible options', () => {
	const commandString = `./bin/ika.js ${command} https://github.com/Test-Owner/Test-Repo --name 'Test Project' --token 'Test-Token'`
	test(`Running the command handler without 'body' NOR 'stdin' throws an error`, async () => {
		expect.assertions(1)
		try {
			require('child_process').execSync(commandString)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('Missing required argument: body.'))
		}
	})
	test(`Running the command handler with 'body' AND 'stdin' throws an error`, async () => {
		expect.assertions(1)
		try {
			require('child_process').execSync(`echo 'hello' | ${commandString} --body body.txt`)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('Too many body inputs.'))
		}
	})
	test(`Running the command handler with 'body' but WITHOUT 'stdin' throws an error — if the file is not found.`, async () => {
		expect.assertions(1)
		try {
			require('child_process').execSync(`${commandString} --body expect-file-not-found.txt`)
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('File not found'))
		}
	})
	/**
	 * Note: execSync() spawns a new process that nocks and mocks do not have access to.
	 * So you can only test for errors.
	 * If you test for successful execution, it will actually try to connect to GitHub.
	 * So I'm not sure how to do the next two tests.
	 */
	test.todo(`Running the command handler with 'body' but WITHOUT 'stdin' does NOT throw an error — if the file IS found`)
	test.todo(`Running the command handler WITHOUT 'body' but with 'stdin' does NOT throw an error`)
})

const yarguments = Object.assign({}, requiredArguments.options, {
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
})

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/projects')
		.reply(200, {
			id: 1,
		})
		.post('/projects/1/columns')
		.times(3)
		.reply(200, {
			column_id: 1,
		})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/projects')
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
		await yargsModule.handler(yarguments)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
