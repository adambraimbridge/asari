module.exports = octokit => {
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
			const string = target.split('/');
			const owner = string[0]
			const repo = string[1];

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
