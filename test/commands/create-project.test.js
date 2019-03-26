const yargs = require("yargs");

const organisationFixture = require("../../__mocks__/@octokit/fixtures/createForOrg");

const createProjectCommand = require("../../src/commands/create-project");

jest.spyOn(global.console, "warn").mockImplementation(message => message);

afterEach(() => {
	jest.resetAllMocks();
});

test("`projects:create` command module exports an object that can be used by yargs", () => {
	expect(createProjectCommand).toEqual(
		expect.objectContaining({
			command: expect.stringMatching("projects:create"),
			desc: expect.any(String),
			builder: expect.any(Function),
			handler: expect.any(Function)
		})
	);
});

test("yargs can load the `projects:create` command without any errors or warnings", () => {
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
			name: organisationFixture.name
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler without `name` to throw", async () => {
	expect.assertions(1);
	try {
		await createProjectCommand.handler({
			org: organisationFixture.creator.login
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});
