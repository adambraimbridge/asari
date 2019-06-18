const nock = require('nock')
const { getTopics } = require('../../src/lib/topics')

// Don't let Octokit make network requests
nock.disableNetConnect()

describe('lib/topics.js', () => {
	describe('getTopics', () => {
		test('no personalAccessToken throws an error', async () => {
			expect.assertions(1)
			try {
				await getTopics({})
			} catch (error) {
				expect(error).toBeInstanceOf(Error)
			}
		})

		test('returns topics', async () => {
			nock('https://api.github.com')
				.get('/repos/Test-Owner/Test-Repo/topics')
				.reply(200, {
					names: ['customer-products', 'app'],
				})

			const githubUrl = { owner: 'Test-Owner', repo: 'Test-Repo' }
			const topics = await getTopics({ githubUrl, token: 'someToken' })
			expect(topics).toEqual(['customer-products', 'app'])
		})

		test('returns empty topics', async () => {
			nock('https://api.github.com')
				.get('/repos/Test-Owner/Test-Repo/topics')
				.reply(200, {
					names: [],
				})

			const githubUrl = { owner: 'Test-Owner', repo: 'Test-Repo' }
			const topics = await getTopics({ githubUrl, token: 'someToken' })
			expect(topics).toEqual([])
		})

		test('returns empty array if no topics', async () => {
			nock('https://api.github.com')
				.get('/repos/Test-Owner/Test-Repo/topics')
				.reply(200, {})

			const githubUrl = { owner: 'Test-Owner', repo: 'Test-Repo' }
			const topics = await getTopics({ githubUrl, token: 'someToken' })
			expect(topics).toEqual([])
		})
	})
})
