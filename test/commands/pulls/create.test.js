const yargs = require("yargs")
const nock = require('nock');
const yargsModule = require("../../../src/commands/pulls/create")

// Don't let Octokit make network requests
nock.disableNetConnect();

jest.mock('fs', () => ({
	existsSync: jest.fn().mockReturnValue(true),
	readFileSync: jest.fn().mockReturnValue(true),
}))
jest.spyOn(global.console, "warn");
jest.spyOn(global.console, "log");
afterEach(() => {
	jest.clearAllMocks();
});

describe("Yargs", () => {
	test("`pulls create` command module exports an object that can be used by yargs", () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringMatching("create"),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})

	test("yargs can load the `pulls create` command without any errors or warnings", () => {
		expect(() => {
			yargs.command(
				yargsModule.command,
				yargsModule.desc,
				yargsModule.builder,
				yargsModule.handler
			).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})

	const requiredOptions = {
		owner: "test",
		repo: "test",
		title: "test",
		head: "test",
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
})

describe("Octokit", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.persist()
		.post('/repos/test/test/pulls')
		.reply(200, {})

	test("running the command handler triggers a network request of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			body: "test",
			owner: "test",
			repo: "test",
			title: "test",
			head: "test",
			base: "test",
		})
		expect(successResponse.isDone()).toBe(true)
	})
})

describe("Error output", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.persist()
		.post('/repos/error/error/pulls')
		.reply(422, {
			"message": "Validation Failed",
			"errors": [{
				"resource": "PullRequest",
				"code": "custom",
				"message": "A pull request already exists for error:error."
			}],
			"documentation_url": "https://developer.github.com/v3/pulls/#create-a-pull-request"
		})

	test("Output error responses that are returned from network requests of the GitHub API", async () => {
		const response = await yargsModule.handler({
			token: "error",
			body: "error",
			owner: "error",
			repo: "error",
			title: "error",
			head: "error",
			base: "error",
		})
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching("error"))
	})
}) 
