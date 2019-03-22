module.exports = octokit => {
	return async ({ target, name, description }) => {
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
	};
};
