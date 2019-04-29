const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/delete-comment')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'delete-comment'
const requiredArguments = {
	options: {
		token: 'Test-Token',
		owner: 'Test-Owner',
		repo: 'Test-Repo',
		comment_id: 1,
	},
}

commonTests.describeYargs(yargsModule, commandGroup, command, requiredArguments)

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.delete('/repos/Test-Owner/Test-Repo/pulls/comments/1')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(
			Object.keys(requiredArguments.options, {
				token: 'Test-Token',
			})
		)
		expect(successResponse.isDone()).toBe(true)
	})
})
