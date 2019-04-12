const { fs, vol } = require('memfs')
const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/delete-comment')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

jest.mock('fs', () => {
	const { fs } = require('memfs');
	jest.spyOn(fs, 'access');
	return fs;
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
const command = 'delete-comment'
const requiredOptions = {
	owner: 'test',
	repo: 'test',
	comment_id: 1,
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.delete('/repos/test/test/pulls/comments/1')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			owner: 'test',
			repo: 'test',
			comment_id: 1,
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
