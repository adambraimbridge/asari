const nock = require('nock');
const yargs = require("yargs");
const createProjectCommand = require("../../src/commands/create-project");
jest.spyOn(global.console, "warn");

// Don't let Octokit make network requests
nock.disableNetConnect();

afterEach(() => {
	jest.resetAllMocks();
});

test("`project:create` command module exports an object that can be used by yargs", () => {
	expect(createProjectCommand).toEqual(
		expect.objectContaining({
			command: expect.stringMatching("project:create"),
			desc: expect.any(String),
			builder: expect.any(Function),
			handler: expect.any(Function)
		})
	);
});

test("yargs can load the `project:create` command without any errors or warnings", () => {
	expect(() => {
		yargs.command(
			createProjectCommand.command,
			createProjectCommand.desc,
			createProjectCommand.builder,
			createProjectCommand.handler
		).argv;
	}).not.toThrow();

	expect(console.warn).not.toBeCalled();
});

test("running command handler without `org` to throw", async () => {
	expect.assertions(1);
	try {
		await createProjectCommand.handler({
			name: "test"
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler without `name` to throw", async () => {
	expect.assertions(1);
	try {
		await createProjectCommand.handler({
			org: "test"
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});
