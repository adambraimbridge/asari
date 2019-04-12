const { fs, vol } = require('memfs')
const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/create-review-request')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

jest.mock('fs', () => {
	const { fs } = require('memfs')
	jest.spyOn(fs, 'access')
	return fs
})
jest.spyOn(global.console, 'warn')
afterEach(() => {
	vol.reset()
	fs.access.mockReset()
	jest.clearAllMocks()
})

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'create-review-request'
const requiredOptions = {
	owner: 'test',
	repo: 'test',
	number: 1,
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/test/test/pulls/1/requested_reviewers')
		.reply(200, {})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			owner: 'test',
			repo: 'test',
			number: 1,
			reviewers: 'test',
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
