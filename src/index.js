const Octokit = require('@octokit/rest');

module.exports = ({ personalAccessToken }) => {

    if (!personalAccessToken) {
        throw new Error('github tooling helper: Missing personalAccessToken option - https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/');
    }

    const octokit = new Octokit({
        headers: {
            /**
             * Access Projects API using this Accept header while it is under preview
             *
             * @see https://developer.github.com/v3/projects
             */
            Accept: 'application/vnd.github.inertia-preview+json'
        }
    });

    /**
     * Authenticate GitHub API calls using GitHub personal access token
     *
     * @see https://github.com/octokit/rest.js#authentication
     */
    octokit.authenticate({
        type: 'token',
        token: personalAccessToken
    });

    const createProject = require('./create-project')(octokit);
    const createProjectColumn = require('./create-project-column')(octokit);
    const createPullRequest = require('./create-pull-request')(octokit);
    const createPullRequestCard = require('./create-card')(octokit);

    return {
        createProject,
        createProjectColumn,
        createPullRequest,
        createPullRequestCard,
    };
};
