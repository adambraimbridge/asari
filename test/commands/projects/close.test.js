const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/projects/close')

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
const commandGroup = 'projects'
const command = 'close'
const requiredOptions = {
	'github-url': 'https://github.com/orgs/Test-Owner/projects/123',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

const yarguments = {
	token: 'test',
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', number: 1 },
}
describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.get('/repos/Test-Owner/Test-Repo/projects?state=all&per_page=100')
		.reply(200, [
			{
				number: 1,
				id: 1,
			},
		])
		.patch('/projects/1')
		.reply(200, {
			html_url: 'https://github.com/test/test/projects/1',
			state: 'closed',
		})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.get('/repos/Test-Owner/Test-Repo/projects?state=all&per_page=100')
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
