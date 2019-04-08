const Octokit = require('@octokit/rest');

module.exports = ({ personalAccessToken }) => {
	if (!personalAccessToken) {
		throw new Error(
			'github tooling helper: Missing personalAccessToken option - https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/'
		);
	}

	const octokit = new Octokit({
		previews: [
			/**
			 * Access Projects API while it is under preview
			 *
			 * @see https://developer.github.com/v3/projects
			 */
			'inertia-preview'
		],
		/**
		 * Authenticate GitHub API calls using GitHub personal access token
		 *
		 * @see https://github.com/octokit/rest.js#authentication
		 */
		auth: `token ${personalAccessToken}`
	});

	const createProject = require('./github/create-project')(octokit);
	const closeProject = require('./github/close-project')(octokit);
	const listProjects = require('./github/list-projects')(octokit);
	const createProjectColumn = require('./github/create-project-column')(octokit);
	const createPullRequest = require('./github/create-pull-request')(octokit);
	const createPullRequestCard = require('./github/create-card')(octokit);

	return {
		createProject,
		closeProject,
		listProjects,
		createProjectColumn,
		createPullRequest,
		createPullRequestCard
	};
};
