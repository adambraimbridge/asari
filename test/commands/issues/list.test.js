const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/issues/list')

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
const command = 'issues list'
const requiredArguments = {
	options: {
		token: 'Test-Token',
		type: 'assigned',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.get('/issues?filter=assigned')
		.reply(200, [{ title: 'Test-Issue-01', created_at: 'Test-Date-01', html_url: 'Test-URL-01' }, { title: 'Test-Issue-02', created_at: 'Test-Date-02', html_url: 'Test-URL-02' }])

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(requiredArguments.options)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.get('/issues?filter=assigned')
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
		await yargsModule.handler(requiredArguments.options)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
