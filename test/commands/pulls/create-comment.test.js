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
	body: 'Test-Body',
	'github-url': 'https://github.com/Test-Owner/Test-Repo/pull/1',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/issues/1/comments')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'Test-Token',
			githubUrl: {
				owner: 'Test-Owner',
				repo: 'Test-Repo',
				number: 1,
			},
			bodyContent: 'Test-Body',
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
