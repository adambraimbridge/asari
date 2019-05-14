const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/merge')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

/**
 * Common Yargs tests
 */
const command = 'merge-pull-request'
const requiredArguments = {
	options: {
		token: 'Test-Token',
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo/tree/Test-Branch',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = Object.assign({}, requiredArguments.options, {
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo', number: 1 },
	method: 'merge',
})

describe('Octokit', () => {
	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.put('/repos/Test-Owner/Test-Repo/pulls/1/merge')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})
})

describe('Error output', () => {
	test(`Running the command handler with an invalid github-url throws an error`, async () => {
		expect.assertions(1)
		try {
			/**
			 * Note: execSync() spawns a new process that nocks and mocks do not have access to.
			 * So you can only test for errors.
			 * If you test for successful execution, it will actually try to connect to GitHub.
			 */
			require('child_process').execSync(`./bin/ika.js ${command} this-is-an-unvalid-github-url`)
		} catch (error) {
			expect(error.message).toMatch(new RegExp(`Invalid GitHub URL`, 'i'))
		}
	})
})
