const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/create-comment')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'create-comment'
const requiredOptions = {
	owner: 'test',
	repo: 'test',
	body: 'test',
	number: 1,
	commit_id: 1,
	path: 'test',
	position: 1,
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/test/test/pulls/1/comments')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			body: 'test',
			owner: 'test',
			repo: 'test',
			number: 1,
			commit_id: 1,
			path: 'test',
			position: 1,
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
