const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/create-review-request')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const command = 'pulls create-review-request'
const requiredArguments = {
	options: {
		token: 'Test-Token',
		reviewers: 'Test-Reviewer',
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo/pull/1',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = Object.assign({}, requiredArguments.options, {
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', number: 1 },
})

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/Test-Owner/Test-Repo/pulls/1/requested_reviewers')
		.reply(200, {})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})
