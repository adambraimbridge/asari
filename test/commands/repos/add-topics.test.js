const nock = require('nock')
const commonTests = require('../../common-tests')
const yargsModule = require('../../../src/commands/repos/add-topics')

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
const command = 'repos add-topics'
const requiredArguments = {
	options: {
		token: 'Test-Token',
		topics: ['hello'],
	},
	positionals: {
		'github-url': 'https://github.com/Test-Owner/Test-Repo',
	},
}
commonTests.describeYargs(yargsModule, command, requiredArguments)

describe('Add topic', () => {
	test('triggers network requests on the GitHub API', async () => {
		nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: ['customer-products'],
			})

		const response = nock('https://api.github.com')
			.put('/repos/Test-Owner/Test-Repo/topics', {
				names: ['customer-products', 'app'],
			})
			.reply(200, {
				names: ['customer-products', 'app'],
			})
		const args = {
			token: 'Test-Token',
			githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
			topics: ['app'],
		}

		await yargsModule.handler(args)
		expect(response.isDone()).toBe(true)
	})

	test('shows new topics', async () => {
		nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: [],
			})
			.put('/repos/Test-Owner/Test-Repo/topics', {
				names: ['hello'],
			})
			.reply(200, {
				names: ['hello'],
			})
		const args = {
			token: 'Test-Token',
			githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
			topics: ['hello'],
		}
		await yargsModule.handler(args)
		expect(console.log).toBeCalledWith('hello')
	})

	test('Running the command handler shows new topics in a newline separated list', async () => {
		nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: ['customer-products'],
			})
			.put('/repos/Test-Owner/Test-Repo/topics', {
				names: ['customer-products', 'app'],
			})
			.reply(200, {
				names: ['customer-products', 'app'],
			})
		const args = {
			token: 'Test-Token',
			githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
			topics: ['app'],
		}
		await yargsModule.handler(args)
		expect(console.log).toBeCalledWith('customer-products\napp')
	})
})

describe('Error output', () => {
	test('Output error responses that are returned from network requests of the GitHub API', async () => {
		// If this endpoint is not called, nock.isDone() will be false.
		const errorResponse = nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: ['customer-products'],
			})
			.put('/repos/Test-Owner/Test-Repo/topics')
			.reply(422, {
				message: 'Validation Failed',
				errors: ['Topics must start with a lowercase letter or number, consist of 35 characters or less, and can include hyphens.'],
			})

		const args = {
			token: 'Test-Token',
			githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
			topics: ['app'],
		}
		await yargsModule.handler(args)
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})

	test('Output error response when the repository is not found', async () => {
		nock('https://api.github.com')
			.get('/repos/Test-Owner/Test-Repo/topics')
			.reply(200, {
				names: ['customer-products'],
			})
			.put('/repos/Test-Owner/Test-Repo/topics')
			.reply(404, {
				message: 'Not found',
			})
		const args = {
			token: 'Test-Token',
			githubUrl: { owner: 'Test-Owner', repo: 'Test-Repo' },
			topics: ['app'],
		}
		await yargsModule.handler(args)
		expect(console.log).toBeCalledWith(expect.stringMatching(/Not found/i))
	})
})
