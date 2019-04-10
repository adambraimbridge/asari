const nock = require('nock');
const commonTests = require("../../common-tests")
const yargsModule = require("../../../src/commands/pulls/open")

// Don't let Octokit make network requests
nock.disableNetConnect();

// Reset any mocked network endpoints
nock.cleanAll()

jest.mock('fs', () => ({
	existsSync: jest.fn().mockReturnValue(true),
	readFileSync: jest.fn().mockReturnValue(true),
}))
jest.spyOn(global.console, "warn");
afterEach(() => {
	jest.clearAllMocks();
});

/**
 * Common Yargs tests
 */
const commandGroup = 'pulls'
const command = 'open'
const requiredOptions = {
	owner: "test",
	repo: "test",
	number: 1,
}
commonTests.describeYargs(yargsModule, commandGroup, command, requiredOptions)

describe("Octokit", () => {

	// If this endpoint is not called, nock.isDone() will be false.
	const successResponse = nock('https://api.github.com')
		.patch('/repos/test/test/pulls/1')
		.reply(200, {})

	test("running the command handler triggers a network request of the GitHub API", async () => {
		await yargsModule.handler({
			token: "test",
			owner: "test",
			repo: "test",
			number: 1,
		})
		expect(successResponse.isDone()).toBe(true)
	})
})
