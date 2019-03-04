const github = require('../index');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = (yargs) => {
    return yargs
        .option('column', {
            describe: 'Project column ID',
            demandOption: true,
            type: 'number',
        })
        .option('pull-request', {
            describe: 'Pull request ID',
            demandOption: true,
            type: 'number',
        })
        .option('token', {
            describe: 'GitHub personal access token',
            demandOption: true,
            type: 'string',
        });
};

/**
 * Add a pull request to an organisation's project.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {number} argv.column
 * @param {number} argv.pullRequest
 */
const handler = async ({ token, column, pullRequest }) => {

    if (isNaN(column) || isNaN(pullRequest)) {
        throw new Error('Column and pull request ID must be a number');
    }

    const { createPullRequestCard } = github({
        personalAccessToken: token
    });

    const inputs = {
        column_id: column,
        content_id: pullRequest,
        content_type: 'PullRequest'
    };

    try {
        await createPullRequestCard(inputs);
    } catch (error) {
        throw new Error(`Adding a pull request to a project failed. Response: ${error}.`)
    }
};

module.exports = {
    command: 'project:add-pull-request',
    desc: 'Add a pull request to a project',
    builder,
    handler
};
