const nock = require('nock');
const yargs = require("yargs");
const addPullRequestCommand = require("../../../src/commands/projects/create-card");
jest.spyOn(global.console, "warn");

// Don't let Octokit make network requests
nock.disableNetConnect();

afterEach(() => {
	jest.clearAllMocks();
});

test("`projects create-card` command module exports an object that can be used by yargs", () => {
	expect(addPullRequestCommand).toEqual(
		expect.objectContaining({
			command: expect.stringMatching("projects create-card"),
			desc: expect.any(String),
			builder: expect.any(Function),
			handler: expect.any(Function)
		})
	);
});

test("yargs can load the `projects create-card` command without any errors or warnings", () => {
	expect(() => {
		yargs.command(
			addPullRequestCommand.command,
			addPullRequestCommand.desc,
			addPullRequestCommand.builder,
			addPullRequestCommand.handler
		).argv;
	}).not.toThrow();

	expect(console.warn).not.toBeCalled();
});

test("running command handler with a `column` ID as a string is expected to throw", async () => {
	expect.assertions(1);
	try {
		await addPullRequestCommand.handler({
			column: "ID",
			pullRequest: 1
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler with a `pullRequest` ID as a string is expected to throw", async () => {
	expect.assertions(1);
	try {
		await addPullRequestCommand.handler({
			column: 1,
			pullRequest: "ID"
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});
