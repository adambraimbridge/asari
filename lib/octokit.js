const Octokit = require('@octokit/rest')

module.exports = async ({ personalAccessToken }) => {
	if (!personalAccessToken) {
		throw new Error('github tooling helper: Missing personalAccessToken option - https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/')
	}

	/**
	 * Return an authenticated instance of Octokit
	 */
	try {
		return await new Octokit({
			previews: [
				/**
				 * Access Projects API while it is under preview
				 *
				 * @see https://developer.github.com/v3/projects
				 */
				'inertia-preview',
			],
			/**
			 * Authenticate GitHub API calls using GitHub personal access token
			 *
			 * @see https://github.com/octokit/rest.js#authentication
			 */
			auth: `token ${personalAccessToken}`,
		})
	} catch (error) {
		throw new Error(error)
	}
}
