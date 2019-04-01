const nock = require('nock');
const yargs = require("yargs");
const createPullRequestCommand = require("../../src/commands/create-pull-request");
jest.spyOn(global.console, "warn");

// Don't let Octokit make network requests
nock.disableNetConnect();
test("`pull-request:create` command module exports an object that can be used by yargs", () => {
	expect(createPullRequestCommand).toEqual(
		expect.objectContaining({
			command: expect.stringMatching("pull-request:create"),
			desc: expect.any(String),
			builder: expect.any(Function),
			handler: expect.any(Function)
		})
	);
});

test("yargs can load the `pull-request:create` command without any errors or warnings", () => {
	expect(() => {
		yargs.command(
			createPullRequestCommand.command,
			createPullRequestCommand.desc,
			createPullRequestCommand.builder,
			createPullRequestCommand.handler
		).argv;
	}).not.toThrow();

	expect(console.warn).not.toBeCalled();
});

test("running command handler without `owner` to throw an error", async () => {
	expect.assertions(1);
	try {
		await createPullRequestCommand.handler({
			repo: "test",
			title: "test",
			branch: "test",
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler without `repo` to throw an error", async () => {
	expect.assertions(1);
	try {
		await createPullRequestCommand.handler({
			owner: "test",
			title: "test",
			branch: "test",
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler without `title` to throw an error", async () => {
	expect.assertions(1);
	try {
		await createPullRequestCommand.handler({
			owner: "test",
			repo: "test",
			branch: "test",
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("running command handler without `branch` to throw an error", async () => {
	expect.assertions(1);
	try {
		await createPullRequestCommand.handler({
			owner: "test",
			repo: "test",
			title: "test",
		});
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});
