const yargs = require("yargs")
const nock = require('nock');
const yargsModule = require("../../../src/commands/pulls/create-review-request")

// Don't let Octokit make network requests
nock.disableNetConnect();

// Reset any mocked network endpoints
nock.cleanAll()

jest.spyOn(global.console, "warn");
afterEach(() => {
	jest.clearAllMocks();
});

describe("Yargs", () => {
	test("`pulls create-review-request` command module exports an object that can be used by yargs", () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringMatching("create-review-request"),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})

	test("yargs can load the `pulls create-review-request` command without any errors or warnings", () => {
		expect(() => {
			yargs.command(yargsModule).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})

	const requiredOptions = {
		owner: "test",
		repo: "test",
		number: 1,
	}
	for (let option of Object.keys(requiredOptions)) {
		test(`Running the command handler without '${option}' throws an error`, async () => {
			expect.assertions(1)
			try {
				const testOptions = Object.assign({}, requiredOptions)
				delete testOptions[option]
				await yargsModule.handler(testOptions)
			} catch (error) {
				expect(error).toBeInstanceOf(Error)
			}
		})
	}
	test(`Running the command handler without 'reviewers' or 'team_reviewers' throws an error`, async () => {
		expect.assertions(1)
		try {
			await yargsModule.handler(requiredOptions)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
		}
	})
})

describe("Octokit", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.post('/repos/test/test/pulls/1/requested_reviewers')
		.reply(200, {})

	test("Running the command handler triggers a network request of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			owner: "test",
			repo: "test",
			number: 1,
			reviewers: "test",
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
