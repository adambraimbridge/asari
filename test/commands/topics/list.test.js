const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/topics/list')

beforeEach(() => {
	jest
		.spyOn(console, 'log')
		.mockImplementation()
		.mockName('console.log')

	// Don't let Octokit make network requests
	nock.disableNetConnect()
})

afterEach(() => {
	jest.resetAllMocks()
	nock.cleanAll()
})

/**
 * Common Yargs tests
 */
const command = 'topics list'
const requiredArguments = {
	options: {
		token: 'Test-Token',
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

const yarguments = {
	token: 'Test-Token',
	githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
}
describe('List topics', () => {
	let successResponse
	beforeEach(() => {
		// If this endpoint is not called, nock.isDone() will be false.
		successResponse = nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: ['customer-products', 'app'],
			})
		jest
			.spyOn(console, 'log')
			.mockImplementation()
			.mockName('console.log')
	})

	test('Running the command handler triggers a network request of the GitHub API', async () => {
		await yargsModule.handler(yarguments)
		expect(successResponse.isDone()).toBe(true)
	})

	test('Running the command handler shows topics in a newline separated list', async () => {
		await yargsModule.handler(yarguments)
		expect(console.log).toBeCalledWith('customer-products\napp')
	})
})

describe('Error output', () => {
	test('Output error responses that are returned from network requests of the GitHub API', async () => {
		// If this endpoint is not called, nock.isDone() will be false.
		const errorResponse = nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
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

		await yargsModule.handler(yarguments)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})

	test('Output error response when the repository is not found', async () => {
		nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(404, {
				message: 'Not found',
			})
		await yargsModule.handler(yarguments)
		expect(console.log).toBeCalledWith(expect.stringMatching(/Not found/i))
	})
})
