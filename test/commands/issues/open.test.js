const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/issues/open')

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
const command = 'issues open'
const requiredArguments = {
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo/issues/123',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = {
	token: 'Test-Token',
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', value: 1 },
}
describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.patch('/repos/Test-Owner/Test-Repo/issues/1')
		.reply(200)

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.patch('/repos/Test-Owner/Test-Repo/issues/1')
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
