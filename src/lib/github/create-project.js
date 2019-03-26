module.exports = octokit => {
	/**
	 * Based on the option passed in, either `org`, `repo` or `user` will be defined.
	 */
	return async ({ org, repo, user, target, name, description }) => {
		if (org) {
			/**
			 * Create a GitHub organisation project.
			 *
			 * @see https://octokit.github.io/rest.js/#api-Projects-createForOrg
			 */
			const result = await octokit.projects.createForOrg({
				org: target,
				name,
				body: description
			});

			return result.data;
		}

		if (user) {
			/**
			 * Create a GitHub user project.
			 *
			 * @see https://octokit.github.io/rest.js/#api-Projects-createForAuthenticatedUser
			 */
			const result = await octokit.projects.createForAuthenticatedUser({
				name,
				body: description
			});

			return result.data;
		}

		if (repo) {
			/**
			 * Create a GitHub repository project.
			 *
			 * @see https://octokit.github.io/rest.js/#api-Projects-createForRepo
			 */
			const [owner, repo] = target.split('/');

			const result = await octokit.projects.createForRepo({
				owner,
				repo,
				name,
				body: description
			});

			return result.data;
		}
	};
};
