const yargs = require('yargs');

const columnFixture = require('../../__mocks__/@octokit/fixtures/createColumn');

const cardFixture = require('../../__mocks__/@octokit/fixtures/createCard');

const addPullRequestCommand = require('../../src/commands/create-card');

jest.spyOn(global.console, 'warn')
    .mockImplementation((message) => message);

afterEach(() => {
    jest.clearAllMocks();
});

test('`project:add-pull-request` command module exports an object that can be used by yargs', () => {
    expect(addPullRequestCommand).toEqual(
        expect.objectContaining({
            command: expect.stringMatching('project:add-pull-request'),
            desc: expect.any(String),
            builder: expect.any(Function),
            handler: expect.any(Function)
        })
    );
});

test('yargs can load the `project:add-pull-request` command without any errors or warnings', () => {
    expect(() => {
        yargs.command(
            addPullRequestCommand.command,
            addPullRequestCommand.desc,
            addPullRequestCommand.builder,
            addPullRequestCommand.handler
        ).argv
    }).not.toThrow();

    expect(console.warn).not.toBeCalled();
});

test('running command handler with a `column` ID as a string is expected to throw', async () => {
    expect.assertions(1);
    try {
        await addPullRequestCommand.handler({
            column: 'ID',
            pullRequest: cardFixture.id
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});

test('running command handler with a `pullRequest` ID as a string is expected to throw', async () => {
    expect.assertions(1);
    try {
        await addPullRequestCommand.handler({
            column: columnFixture.id,
            pullRequest: 'ID'
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});

