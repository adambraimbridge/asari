const yargs = require("yargs")
const nock = require('nock');
const yargsModule = require("../../../src/commands/projects/create")

// Don't let Octokit make network requests
nock.disableNetConnect();

// Reset any mocked network endpoints
nock.cleanAll()

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
	test("`projects create` command module exports an object that can be used by yargs", () => {
		expect(yargsModule).toEqual(
			expect.objectContaining({
				command: expect.stringMatching("create"),
				desc: expect.any(String),
				builder: expect.any(Function),
				handler: expect.any(Function),
			})
		)
	})

	test("yargs can load the `projects create` command without any errors or warnings", () => {
		expect(() => {
			yargs.command(yargsModule).argv
		}).not.toThrow()
		expect(console.warn).not.toBeCalled()
	})

	const requiredOptions = {
		owner: "test",
		name: "test",
		body: "test",
		account_type: "test",
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
		.post('/user/projects')
		.reply(200, {
			project_id: 1
		})
		.post('/projects/1/columns')
		.times(3)
		.reply(200, {
			column_id: 1
		})

	test("Running the command handler triggers a network request of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			owner: "test",
			name: "test",
			body: "test",
			account_type: "user",
		})
		expect(successResponse.isDone()).toBe(true)
	})
})

describe("Error output", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const errorResponse = nock('https://api.github.com')
		.post('/orgs/test/projects')
		.reply(422, {
			"message": "Validation Failed",
			"errors": [{
				"resource": "MockResource",
				"code": "custom",
				"message": "This is a mock error message."
			}],
		})

	test("Output error responses that are returned from network requests of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			owner: "test",
			name: "test",
			body: "test",
			account_type: "org",
		})
		expect(errorResponse.isDone()).toBe(true)
		expect(console.log).toBeCalledWith(expect.stringMatching(/error/i))
	})
})
