const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/create')

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
const commandGroup = 'pulls'
const command = 'create'
const requiredOptions = {
	owner: 'test',
	repo: 'test',
	title: 'test',
	head: 'test',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/test/test/pulls')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			body: 'body.txt',
			owner: 'test',
			repo: 'test',
			title: 'test',
			head: 'test',
			base: 'test',
		})
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/repos/error/error/pulls')
		.reply(422, {
			message: 'Validation Failed',
			errors: [
				{
					resource: 'PullRequest',
					code: 'custom',
					message: 'A pull request already exists for error:error.',
				},
			],
			documentation_url: 'https://developer.github.com/v3/pulls/#create-a-pull-request',
		})

	test('Output error responses that are returned from network requests of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'error',
			body: 'body.txt',
			owner: 'error',
			repo: 'error',
			title: 'error',
			head: 'error',
			base: 'error',
		})
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
