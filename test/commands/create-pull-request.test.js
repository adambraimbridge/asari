const yargs = require('yargs');

const pullRequestFixture = require('../../__mocks__/@octokit/fixtures/create');

const createPullRequestCommand = require('../../src/commands/create-pull-request');

jest.spyOn(global.console, 'warn')
    .mockImplementation((message) => message);

test('`pull-request:create` command module exports an object that can be used by yargs', () => {
    expect.objectContaining({
        command: expect.stringMatching('project:create'),
        desc: expect.any(String),
        builder: expect.any(Function),
        handler: expect.any(Function)
    });
});

test('yargs can load the `pull-request:create` command without any errors or warnings', () => {
    expect(() => {
        yargs.command(
            createPullRequestCommand.command,
            createPullRequestCommand.desc,
            createPullRequestCommand.builder,
            createPullRequestCommand.handler
        ).argv
    }).not.toThrow();

    expect(console.warn).not.toBeCalled();
});

test('running command handler without `owner` to throw an error', async () => {
    expect.assertions(1);
    try {
        await createPullRequestCommand.handler({
            repo: pullRequestFixture.head.repo.html_url,
            title: pullRequestFixture.title,
            branch: pullRequestFixture.head.label,
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});

test('running command handler without `repo` to throw an error', async () => {
    expect.assertions(1);
    try {
        await createPullRequestCommand.handler({
            owner: pullRequestFixture.user.login,
            title: pullRequestFixture.title,
            branch: pullRequestFixture.head.label,
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});

test('running command handler without `title` to throw an error', async () => {
    expect.assertions(1);
    try {
        await createPullRequestCommand.handler({
            owner: pullRequestFixture.user.login,
            repo: pullRequestFixture.head.repo.html_url,
            branch: pullRequestFixture.head.label,
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});

test('running command handler without `branch` to throw an error', async () => {
    expect.assertions(1);
    try {
        await createPullRequestCommand.handler({
            owner: pullRequestFixture.user.login,
            repo: pullRequestFixture.head.repo.html_url,
            title: pullRequestFixture.title,
        });
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});
