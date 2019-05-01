const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/create')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const command = 'create-pull-request'
const requiredArguments = {
	options: {
		token: 'Test-Token',
		body: 'body.txt',
		title: 'Test-Title',
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo/tree/Test-Branch',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = Object.assign({}, requiredArguments.options, {
	base: 'Test-Base',
	bodyContent: 'This is a test',
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', value: 'Test-Branch' },
})
describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/pulls')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/pulls')
		.reply(422, {
			message: 'Validation Failed',
			errors: [
				{
					resource: 'PullRequest',
					code: 'custom',
					message: 'A pull request already exists. This is a mocked error, for testing.',
				},
			],
			documentation_url: 'https://developer.github.com/v3/pulls/#create-a-pull-request',
		})

	test('Output error responses that are returned from network requests of the GitHub API', async () => {
		jest.spyOn(global.console, 'log')
		await yargsModule.handler(yarguments)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
