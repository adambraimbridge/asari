const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/pulls/merge')

// Don't let Octokit make network requests
nock.disableNetConnect()

// Reset any mocked network endpoints
nock.cleanAll()

jest.spyOn(global.console, 'warn')
afterEach(() => {
	fs.access.mockReset()
	jest.clearAllMocks()
})

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'merge'
const requiredArguments = {
	token: 'test',
	pullRequest: 'https://github.com/test/test/',
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredArguments)

describe('Octokit', () => {
	test('an invalid pull request URL errors', async () => {
		expect.assertions(1)
		try {
			const testOptions = {
				token: 'test',
				pullRequest: 'foo-bar',
			}
			await yargsModule.handler(testOptions)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
		}
	})

	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.put('/repos/test/test/pulls/1/merge')
		.reply(200, {})

	test('running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler({
			token: 'test',
			pullRequest: {
				owner: 'test',
				repo: 'test',
				number: 1,
			},
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
