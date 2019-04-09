const yargs = require("yargs")
const nock = require('nock');
const yargsModule = require("../../../src/commands/projects/add-pull-request")

// Don't let Octokit make network requests
nock.disableNetConnect();

// Reset any mocked network endpoints
nock.cleanAll()

jest.spyOn(global.console, "warn");
jest.spyOn(global.console, "log");
afterEach(() => {
	jest.clearAllMocks();
});

describe("Yargs", () => {
	test("`projects add-pull-request` command module exports an object that can be used by yargs", () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringMatching(/add/i),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})

	test("yargs can load the `projects add-pull-request` command without any errors or warnings", () => {
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
		column_id: 1,
		pull_request_id: 1,
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
		.post('/projects/columns/1/cards')
		.reply(200)

	test("Running the command handler triggers a network request of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			column_id: 1,
			pull_request_id: 1,
		})
		expect(successResponse.isDone()).toBe(true)
	})
})

describe("Error output", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/projects/columns/1/cards')
		.reply(422, {
			"message": "Validation Failed",
			"errors": [{
				"resource": "MockResource",
				"code": "custom",
				"message": "This is a mock error message."
			}],
		})

	test("Output error responses that are returned from network requests of the GitHub API", async () => {
		const response = await yargsModule.handler({
			token: "test",
			column_id: 1,
			pull_request_id: 1,
		})
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
