module.exports = octokit => {
	return async ({ org, name, body }) => {
		/**
		 * Create a GitHub organisation project.
		 *
		 * @see https://octokit.github.io/rest.js/#api-Projects-createForOrg
		 */
		const result = await octokit.projects.createForOrg({ org, name, body });

		return result.data;
	};
};
