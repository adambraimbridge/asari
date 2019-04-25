const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/projects/add-pull-request')

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
const command = 'add-pull-request'
const requiredOptions = {
	'column-url': 'https://github.com/Test-Owner/test-repository/pull/12345#column-67890',
	'pull-request-url': 'https://github.com/Test-Owner/test-repository/pull/12345',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

const yarguments = {
	token: 'test',
	columnUrl: { id: '1' },
	pullRequestUrl: { id: '1' },
}
describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/projects/columns/1/cards')
		.reply(200)

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/projects/columns/1/cards')
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
