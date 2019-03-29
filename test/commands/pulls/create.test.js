const yargs = require("yargs")

// const pullRequestFixture = require("../../__mocks__/@octokit/fixtures/create")
const yargsModule = require("../../../src/commands/pulls/create")

jest.spyOn(global.console, "warn")

test("`pulls create` command module exports an object that can be used by yargs", () => {
	expect(yargsModule).toEqual(
		expect.objectContaining({
			command: expect.stringMatching("pulls create"),
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

test("running command handler without `owner` to throw an error", async () => {
	expect.assertions(1)
	try {
		await yargsModule.handler({
			repo: "https://github.com/octocat",
			title: "Test: Error expected",
			branch: "test-branch"
		})
	} catch (error) {
		expect(error).toBeInstanceOf(Error)
	}
})

test("running command handler without `repo` to throw an error", async () => {
	expect.assertions(1)
	try {
		await yargsModule.handler({
			owner: "Octocat",
			title: "Test: Error expected",
			branch: "test-branch"
		})
	} catch (error) {
		expect(error).toBeInstanceOf(Error)
	}
})

test("running command handler without `title` to throw an error", async () => {
	expect.assertions(1)
	try {
		await yargsModule.handler({
			owner: "Octocat",
			repo: "https://github.com/octocat",
			branch: "test-branch"
		})
	} catch (error) {
		expect(error).toBeInstanceOf(Error)
	}
})

test("running command handler without `branch` to throw an error", async () => {
	expect.assertions(1)
	try {
		await yargsModule.handler({
			owner: "Octocat",
			repo: "https://github.com/octocat",
			title: "Test: Error expected",
		})
	} catch (error) {
		expect(error).toBeInstanceOf(Error)
	}
})